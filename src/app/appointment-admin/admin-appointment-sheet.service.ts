import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Quote } from "../app.service";

@Injectable({
  providedIn: "root",
})
export class AdminAppointmentService {

  constructor(private _db: AngularFirestore) {}

  public getCustomers(): Observable<any> {
    return this._db.collection("contacts", ref => ref.orderBy("name")).valueChanges({idField: 'id'});
  }

  public createAppointment(appointment: Appointment): Promise<any> {
    return this._db.collection<any>("appointments").add({...appointment});
  }
}


export class Appointment {
  id: string;
  createdAt: any;
  appointment: any;
  name: string;
  number?: string = '';
  ig?: string = '';
  userId?: string;
  confirm?: boolean;
  paid?: number;
}


export class Blackout {
  createdAt: any;
  day: any;
}