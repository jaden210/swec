import { Component, OnInit } from "@angular/core";
import { SignInService } from "../login/login.service";
import { Category, DisplayType, Item, AdminService, Gallery, ObjectFit } from "./admin.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { Observable, combineLatest } from "rxjs";
import { InfoDialog } from "../shared/info-dialog/info-dialog.component";
import { Location } from "@angular/common";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { finalize } from "rxjs/operators";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
import { Appointment, Blackout } from "../appointment/appointment-sheet.service";
import * as moment from "moment";
import { trigger, transition, style, animate } from "@angular/animations";
import { AppService } from "../app.service";
import { BlackoutDialog } from "./blackout-dialog/blackout-dialog.component";
import { ImageService } from "./image.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("250ms 500ms ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("250ms ease-in", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AdminComponent implements OnInit {
  
  public appointments: Appointment[] = [];
  public appointmentsSorted: Appointment[] = [];
  public expenses: Expense[] = [];
  public blackouts: Blackout[] = [];
  public gallery: Gallery[] = [];
  public availability;
  public days;
  public loading: boolean = false;
  public aApp = null;
  public view: string = "appointments";
  public views = [
    "appointments",
    "expenses",
    "sales",
    "gallery"
  ];
  public activeImage = null;
  public totalSalesDollars: number = null;
  public error: string;
  public editImage;

  constructor(
    private _adminService: AdminService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _signInService: SignInService,
    private _location: Location,
    private _appService: AppService,
    private _imageService: ImageService
  ) {}

  ngOnInit() {
    this.loading = true;
    this._adminService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
    });
    combineLatest([
      this._appService.getAppointments(),
      this._adminService.getAvailability(),
      this._adminService.getBlackouts(),
      this._adminService.getGallery()
    ]).subscribe((results) => {
      this.appointments = results[0];
      this.appointmentsSorted = results[0].sort((a,b) => a.appointment.toDate() < b.appointment.toDate() ? 1 : -1);
      this.availability = results[1];
      this.blackouts = results[2];
      console.log(results[3]);
      
      this.gallery = results[3];
      this.totalSalesDollars = this.appointments.filter(a => a.paid).map(a => a.paid).reduce((a, b) => a + b, 0);
      this.buildDays();
    });
  }

  public get SalesLength(): number {
    return  this.appointments.filter(a => a.paid).length;
  }

  public buildDays() {
    moment.updateLocale('en', {
      calendar : {
          lastDay : '[Yesterday]',
          sameDay : '[Today]',
          nextDay : '[Tomorrow]',
          lastWeek : '[Last] dddd',
          nextWeek : 'dddd',
          sameElse : 'L'
      }
    });
    this.days = [];
    for (let index = 0; index <= 15; index++) {
      let day: any = {};
      day.day = moment().startOf('day').add(index, "days");
      day.name = moment(day.day).calendar();
      day.times = [];
      let aDay = this.availability.find(t => t.day == moment(day.day).format('dddd').toLowerCase());
      for (let index = 0; index <= ((aDay.closeTime - aDay.openTime) * 2); index++) {
        let time: any = {};
        time.time = moment(day.day).add(((aDay.openTime * 60) + (index * 30)), "minutes");
        time.appointment = this.appointments.find(a => moment(a.appointment.toDate()).isSame(time.time))
        day.times.push(time);
      }
      day.isBlackout = this.blackouts.some(b => moment(b.day.toDate()).isSame(day.day, "day")) || !aDay.isOpen;
      this.days.push(day);
    }
    this.loading = false;
  }


  public updateAppointment(appointment: Appointment, key = null) {
    if (key) appointment[key]= true;
    this._adminService.updateAppointment(appointment);
  }

  public deleteAppointment(appointment: Appointment) {
    this._snackBar.open("delete appointment?", "DELETE", {duration: 8000}).onAction().subscribe(() => {
      this._adminService.deleteAppointment(appointment);
    });
  }

  public addExpense() {
    this.expenses.unshift(new Expense());
  }

  public addImage(): void {
    document.getElementById("image-picker").click();
  }

  public uploadExpenseImage(event, expense: Expense) {
    this.loading = true;
    let file = event.target.files[0];
    this._adminService
      .uploadImage(file)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((imageUrl) => {
        expense.imageUrl = imageUrl;
        this.updateExpense(expense);
      });
  }

  public updateExpense(expense: Expense) {
    if (expense.id) {
      this._adminService.updateExpense(expense);
    } else {
      this._adminService.createExpense(expense)
    }
  } 

  public nextView() {
    let i = this.views.indexOf(this.view) + 1; 
    i = i % this.views.length;
    this.view = this.views[i];
  }

  public setBlackout(day) {
    this._dialog.open(BlackoutDialog, {data: day}).afterClosed().subscribe(shouldBlackout => {
      if (shouldBlackout) {
        let bo = new Blackout();
        bo.createdAt = new Date();
        bo.day = day.day.toDate();
        this._adminService.createBlackout(bo);
      }
    })
  }



  public addAppointment(): void {
    this._appService.bookAppointment(true);
  }












  public getImage(): void {
    if (!this.loading) {
      document.getElementById("image-input").click();
    }
  }

  /* Fired onChange of image input in DOM */
  public setImage(event): void {
    this.loading = true;
    let files = event.target.files;
    for (let file of files) {
      if (!file.type.match("image")) continue;
      if (file.size < 200000) {
        this.saveImage(file);
      } else {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          let image = new Image();
          image.src = fileReader.result as string;
          image.onload = () =>
            this._imageService.resampleImage(image, file.type, 1228).then(
              (res) => {
                // Don't save resized image if larger than original
                res.blob.size >= file.size
                  ? this.saveImage(file)
                  : this.saveImage(res.blob);
              },
              (error) => {
                alert("Error saving image. Please try again.");
                console.error(error);
                this.loading = false;
              }
            );
        };
        fileReader.readAsDataURL(file);
      }
    }
  }
  

  private saveImage(blob) {
    this.error = null;
    const date = new Date().getTime();
    this._imageService.uploadImage(blob, `gallery/${date}`).subscribe(url => {
      this.loading = false;
      this._adminService.addImage({imageUrl: url, rotate: 0, objectFit: ObjectFit.COVER});

      // this.c.detectChanges();
    }, error => {
      this.error = "Images failed to upload.. Please try again";
    });
  }

  public removeImage(image): void {
    const index = this.gallery.indexOf(image);
    if (index >= 0) {
      this.gallery.splice(index, 1);
      this._adminService.removeImage(image);
    }
  }

  public rotateImage(image, index): void {
      image.rotate++;
      if (image.rotate == 4) image.rotate = 0;
      let imag = document.getElementById('img' + index);
      let rotate = 'rotate(' + (image.rotate * 90) + 'deg)';
      imag.style.transform = rotate;
      // this.ref.detectChanges();
      this._adminService.updateImage(image);
    }
    
    public fitImage(image): void {
      image.objectFit =
      image.objectFit == ObjectFit.COVER ? ObjectFit.CONTAIN : ObjectFit.COVER;
      this._adminService.updateImage(image);
  }


}



export class Expense {
  id: string;
  createdAt: any;
  name: string;
  amount: number;
  imageUrl: string;
}
