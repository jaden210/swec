import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { Appointment } from '../appointment/appointment-sheet.service';
import * as moment from "moment";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  appointments: Appointment[] = [];
  totalSales: number;
  ig: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _appService: AppService
  ) { }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params:any) => {
      let contactName = params.params.id;
      this._appService.getAppointmentsByName(contactName).subscribe((appointments: Appointment[]) => {
        this.appointments = appointments;
        this.totalSales = appointments.filter(a => a.paid).map(a => a.paid).reduce((a, b) => a + b, 0);
        this.ig = appointments.filter(a => a.ig)[0]?.ig || null;
      })
    });
  }

  public contact(social: boolean = false) {
    if (social) {
      window.open(`https://instagram.com/${this.ig}`);
    } else {
      window.open(`sms://+1${this.appointments[0].number}?&body=`);
    }
  }

  



}
