import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Quote } from "../app.service";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {

  constructor(private _db: AngularFirestore) {}

  public getAppointments(): Observable<Appointment[]> {
    return this._db.collection<Appointment>("appointments", ref => ref.orderBy("createdAt", "desc")).valueChanges({idField: 'id'});
  }

  public getAvailability(): Observable<any> {
    return this._db.collection("availability").valueChanges({idField: 'id'});
  }

  public getBlackouts(): Observable<any> {
    return this._db.collection("blackouts").valueChanges({idField: 'id'});
  }

  public addToMailingList(email: string): Promise<any> {
    email = email.trim().toLowerCase();
    return this._db.collection<any>("mailing-list").doc(email).set({email: email, createdAt: new Date()});
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
  number?: string;
  ig?: string;
  userId?: string;
  confirm?: boolean;
  paid?: number;
}


export class Blackout {
  createdAt: any;
  day: any;
}