import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private _route: ActivatedRoute,
    private _appService: AppService
  ) { }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params:any) => {
      this._appService.getAppointment(params.params.id).subscribe((appointment: Appointment) => {
        this.appointment = appointment;
        this.appointment.appointment = moment(this.appointment.appointment.toDate()).format("dddd, MMMM Do YYYY, h:mm a");
        this.smsBody = `sms://+1${appointment.number}?&body=Hey%2C%0AJust%20wanted%20to%20let%20you%20know%20that%20I%20received%20your%20appointment%20for%20${appointment.appointment}.%20For%20pre%20tan%20instructions%2C%20see%20my%20site%3A%20https%3A%2F%2Fkokomosprays.com%2Fprep`
      });
    });
  }

}
