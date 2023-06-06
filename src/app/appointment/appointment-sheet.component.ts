import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { combineLatest, of } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/functions";
import * as moment from "moment";
import { Appointment, AppointmentService, Blackout } from "./appointment-sheet.service";
import { take } from "rxjs/operators";
import { AppService } from "../app.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "appointment-sheet",
  templateUrl: "./appointment-sheet.component.html",
  styleUrls: ["./appointment-sheet.component.scss"]
})
export class AppointmentSheetComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  days = [];
  times= [];
  time;
  appointments: Appointment[] = [];
  availability;
  blackouts: Blackout[] = [];
  view: string = 'info';
  name;
  number;
  ig;
  isAdmin: boolean;
  adminDate: any;
  adminTime: any;
  adminPaid: number;
  

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AppointmentSheetComponent>,
    private _appointmentService: AppointmentService,
    private _appService: AppService,
    private _router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.data.isAdmin;
    combineLatest([
      this._appointmentService.getAppointments(),
      this._appointmentService.getAvailability(),
      this._appointmentService.getBlackouts()
    ]).pipe(take(1)).subscribe(results => {
      this.appointments = results[0];
      this.availability = results[1];
      this.blackouts = results[2];
      console.log(this.availability);
      
    });
  }

  public buildDays() {
    if(this.name && ((this.number && this.number.length >= 10) || this.ig)) {
      this.view = this.isAdmin ? 'date' : 'day';
      this.days = [];
<<<<<<< HEAD
      for (let index = 1; index <= 15; index++) {
        let day = moment().startOf('day').add(index, "days");
        let aDay = this.availability.find(t => t.day == moment(day).format('dddd').toLowerCase());
        // let isBlackout = this.blackouts.some(b => moment(b.startTime).isSame(day, "day"));
        if (aDay && aDay.isOpen) {
          day['times'] = [];
          for (let index = 0; index <= ((aDay.closeTime - aDay.openTime) * 2); index++) {
            let time = moment(day).add(((aDay.openTime * 60) + (index * 30)), "minutes");
            if (!this.appointments.find(a => moment(a.appointment.toDate()).isSame(time)) && !this.blackouts.find(b => time.isBetween(moment(b.startTime), moment(b.endTime), "m", "[]"))) day['times'].push(time);
          }
          if (day['times'].length > 0) this.days.push(day);
        }
=======
      for (let index = 0; index <= 15; index++) {
        let day = moment().startOf('day').add(index, "days");
        let aDay = this.availability.find(t => t.day == moment(day).format('dddd').toLowerCase());
        let isBlackout = this.blackouts.some(b => moment(b.day.toDate()).isSame(day, "day"));
        if (aDay && aDay.isOpen && !isBlackout) this.days.push(day);
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
      }
      this.loading = false;
    }
  }

  public setDate() {
    let [hour, minute] = this.adminTime.split(':');
    this.time = moment(this.adminDate).set({hour, minute});
    let appointment = new Appointment();
    appointment.paid = this.adminPaid;
    appointment.confirm = true;
    this.setAppointment(appointment);
  }

  public setDay(day) {
    this.view = 'time';
<<<<<<< HEAD
    this.times = day.times;
=======
    this.loading = true;
    this.times = [];
    let aDay = this.availability.find(t => t.day == moment(day).format('dddd').toLowerCase());
    for (let index = 0; index <= ((aDay.closeTime - aDay.openTime) * 2); index++) {
      let time = moment(day).add(((aDay.openTime * 60) + (index * 30)), "minutes");
      if (!this.appointments.find(a => moment(a.appointment.toDate()).isSame(time))) this.times.push(time);
    }
    this.loading = false;
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  }

  public setTime(time) {
    this.view = 'confirm';
    this.time = time;
  }

  public back() {
    this.buildDays();
  }

  public setAppointment(appointment: Appointment = new Appointment()) {
    this.loading = true;
    var numberPattern = /\d+/g;
    appointment.createdAt = new Date();
<<<<<<< HEAD
    appointment.name = this.name.trim();
    appointment.appointment = this.time.toDate();
    appointment.number = this.number ? this.number.match( numberPattern ).join([]) : null;
    appointment.ig = this.ig || null;
    this._appointmentService.createAppointment(appointment).then(() => {
      this.loading = false;
      this.view = 'done';
      if (this.isAdmin) this.close();
=======
    appointment.name = this.name;
    appointment.appointment = this.time.toDate();
    appointment.number = this.number ? this.number.match( numberPattern ).join([]) : null;
    appointment.ig = this.ig;
    this._appointmentService.createAppointment(appointment).then(() => {
      this.loading = false;
      this.view = 'done';
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
      this._appService.addToContactList(appointment.number, appointment.name, appointment.ig)
    })
  }

<<<<<<< HEAD
  public message(): void {
    window.open("https://www.instagram.com/kokomospraytans/");
  }

=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  public close() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy() {
  }

  public addToGoogleCalendar() {
    window.open(`https://calendar.google.com/calendar/r/eventedit?text=Kokomo+Spray+Tan+Appointment&dates=${moment(this.time).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${moment(this.time).add(30, 'minutes').toISOString().replace(/-|:|\.\d\d\d/g,"")}&details=https://kokomosprays.com&location=1528N+Overland+Trails+Drive+-+Washington,+UT+84780`);
  }

  public nav() {
    window.open(`https://goo.gl/maps/QmngHeZR37uyPfQGA`);
  }

  public prep() {
<<<<<<< HEAD
    this._router.navigate(['/complete']);
=======
    this._router.navigate(['/prep']);
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
    this.close();
  }

}


