import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { Appointment } from '../appointment/appointment-sheet.service';
import * as moment from "moment";

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  appointment: Appointment = new Appointment();
  public smsBody;
  postBody: string = `stuff here `;

  prepBody: string = `stuff here too`;

  smsBodies = [
    {name: "send text", body: encodeURIComponent(this.prepBody)},
    {name: "send other text", body: encodeURIComponent(this.postBody)},
    {name: "start a blank text", body: ``}
  ];


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _appService: AppService
  ) { }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params:any) => {
      this._appService.getAppointment(params.params.id).subscribe((appointment: Appointment) => {
        this.appointment = appointment;
        this.appointment.appointment = moment(this.appointment.appointment.toDate()).format("dddd, MMMM Do YYYY, h:mm a");
      });
    });
  }

  public popSMS(index): void {
    let message = this.smsBodies[index];
    window.open(`sms://+1${this.appointment.number}?&body=${message.body}`);
  }

  public navContact(): void {
    this._router.navigate([`contact`])
  }



}
