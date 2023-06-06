import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService, Contact } from '../app.service';
import * as moment from "moment";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];
  public contactsBody;
  public displayedColumns = [
    "name",
    "number",
    "appointments",
    "createdAt",
    "button"
  ];
  public smsBody = "hey you!! \n\nWrite a really cool message to your fam";

  constructor(
    private _route: ActivatedRoute,
    private _appService: AppService
  ) { }

  ngOnInit(): void {
    this._appService.getContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
    this._appService.getAppointments().subscribe(appointments => {
      this.contacts.forEach(c => {
        c['appointments'] = appointments.filter(a => a.number == c.number) || [];
      });
    });
    if (this._appService.checkMobile()) this.displayedColumns = this.displayedColumns.filter(c => c != 'createdAt' && c != 'appointments');
  }

  get SMS() {
    return encodeURIComponent(this.smsBody);
  }
}
