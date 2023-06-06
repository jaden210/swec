import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { combineLatest, of } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/functions";
import * as moment from "moment";
import { Appointment, AdminAppointmentService, Blackout } from "./admin-appointment-sheet.service";
import { take } from "rxjs/operators";
import { AppService } from "../app.service";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "admin-appointment-sheet",
  templateUrl: "./admin-appointment-sheet.component.html",
  styleUrls: ["./admin-appointment-sheet.component.scss"]
})
export class AdminAppointmentSheetComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  time;
  customers: any[] = [];
  view: string = 'info';
  name;
  number;
  ig;
  adminDate: any;
  adminTime: any;
  adminPaid: number;
  

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdminAppointmentSheetComponent>,
    private _adminAppointmentService: AdminAppointmentService,
    private _appService: AppService,
    private _router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._adminAppointmentService.getCustomers()
    ]).pipe(take(1)).subscribe(results => {
      this.customers = results[0];
    });
  }

  public buildDays() {
    if(this.name && ((this.number && this.number.length >= 10) || this.ig)) {
      this.view = 'date';
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


  public setTime(time) {
    this.view = 'confirm';
    this.time = time;
  }

  public back() {
    this.buildDays();
  }

  public reset() {
    this.view = 'info';
    this.name = null;
    this.number = null;
    this.ig = null;
    this.adminDate = null;
    this.adminPaid = null;
    this.adminTime = null;
  }

  public setCustomer(event) {
    this.name = event.value?.name;
    this.number = event.value?.number;
    this.ig = event.value?.ig;
  }

  public setAppointment(appointment: Appointment = new Appointment()) {
    this.loading = true;
    var numberPattern = /\d+/g;
    appointment.createdAt = new Date();
    appointment.name = this.name.trim();
    appointment.appointment = this.time.toDate();
    appointment.number = this.number ? this.number.match( numberPattern ).join([]) : null;
    appointment.ig = this.ig || null;
    this._adminAppointmentService.createAppointment(appointment).then(() => {
      this.loading = false;
      this.view = 'done';
      this._appService.addToContactList(appointment.number, appointment.name, appointment.ig)
    })
  }

  public close() {
    this._bottomSheetRef.dismiss();
  }

  ngOnDestroy() {
  }

}


