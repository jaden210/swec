import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { combineLatest, of } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/functions";
import * as moment from "moment";
import { Appointment, AppointmentService } from "./appointment-sheet.service";
import { take } from "rxjs/operators";

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
  view: string = 'info';
  name;
  number;
  

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AppointmentSheetComponent>,
    private _appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._appointmentService.getAppointments(),
      this._appointmentService.getAvailability()
    ]).pipe(take(1)).subscribe(results => {
      this.appointments = results[0];
      this.availability = results[1].available;
    });
  }

  public buildDays() {
    if(this.name && this.number && this.number.length > 10) {
      this.view = 'day';
      this.days = [];
      for (let index = 0; index <= 15; index++) {
        let day = moment().startOf('day').add(index, "days");
        let aDay = this.availability.find(t => t.day == moment(day).format('dddd').toLowerCase());
        if (aDay && aDay.isOpen) this.days.push(day);
      }
      this.loading = false;
    }
  }

  public setDay(day) {
    this.view = 'time';
    this.loading = true;
    this.times = [];
    let aDay = this.availability.find(t => t.day == moment(day).format('dddd').toLowerCase());
    for (let index = 0; index <= ((aDay.closeTime - aDay.openTime) * 2); index++) {
      let time = moment(day).add(((aDay.openTime * 60) + (index * 30)), "minutes");
      if (!this.appointments.find(a => moment(a.appointment.toDate()).isSame(time))) this.times.push(time);
    }
    this.loading = false;
  }

  public setTime(time) {
    this.view = 'confirm';
    this.time = time;
  }

  public back() {
    this.buildDays();
  }

  public setAppointment() {
    this.loading = true;
    let appointment = new Appointment();
    appointment.createdAt = new Date();
    appointment.name = "timmy";
    appointment.appointment = this.time.toDate();
    this._appointmentService.createAppointment(appointment).then(() => {
      this.loading = false;
      this.view = 'done';
    })
  }

  public close() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy() {
  }

}


