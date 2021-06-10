import { Component, OnInit } from "@angular/core";
import { SignInService } from "../login/login.service";
import { Category, DisplayType, Item, AdminService } from "./admin.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { Observable, combineLatest } from "rxjs";
import { InfoDialog } from "../shared/info-dialog/info-dialog.component";
import { Location } from "@angular/common";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { finalize } from "rxjs/operators";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
import { Appointment } from "../appointment/appointment-sheet.service";
import * as moment from "moment";
import { trigger, transition, style, animate } from "@angular/animations";

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
  public expenses: Expense[] = [];
  public availability;
  public days;
  public loading: boolean = false;
  public aApp = null;
  public view: string = "appointments";
  public views = [
    "appointments",
    "expenses",
    "sales"
  ];
  public activeImage = null;
  public totalSalesDollars: number = null;


  constructor(
    private _adminService: AdminService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _signInService: SignInService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.loading = true;
    this._adminService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
    });
    combineLatest([
      this._adminService.getAppointments(),
      this._adminService.getAvailability()
    ]).subscribe((results) => {
      this.appointments = results[0];
      this.availability = results[1];
      this.totalSalesDollars = this.appointments.filter(a => a.paid).map(a => a.paid).reduce((a, b) => a + b);
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





}



export class Expense {
  id: string;
  createdAt: any;
  name: string;
  imageUrl: string;
}