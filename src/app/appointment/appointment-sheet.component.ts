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
    this.times = day.times;
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
    appointment.name = this.name.trim();
    appointment.appointment = this.time.toDate();
    appointment.number = (this.number && this.number.match(numberPattern)) ? this.number.match( numberPattern ).join([]) : null;
    this._appointmentService.createAppointment(appointment).then(() => {
      this.loading = false;
      this.view = 'done';
      if (this.isAdmin) this.close();
      this._appService.addToContactList(appointment.number, appointment.name)
    })
  }

  public close() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy() {
  }

  public addToGoogleCalendar() {
    window.open(`https://calendar.google.com/calendar/r/eventedit?text=New+Appointment&dates=${moment(this.time).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${moment(this.time).add(30, 'minutes').toISOString().replace(/-|:|\.\d\d\d/g,"")}&details=https://southwesteandc.com&location=1528N+Overland+Trails+Drive+-+Washington,+UT+84780`);
  }

  public nav() {
    window.open(`https://goo.gl/maps/QmngHeZR37uyPfQGA`);
  }

  public prep() {
    this._router.navigate(['/complete']);
    this.close();
  }

}


