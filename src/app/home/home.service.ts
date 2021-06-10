import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Quote } from "../app.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {

  constructor(private _db: AngularFirestore) {}

  public getQuotes(): Observable<Quote[]> {
    return this._db.collection<Quote>("quotes", ref => ref.orderBy("createdAt", "desc")).valueChanges({idField: 'id'})
  }

  public addToMailingList(email: string): Promise<any> {
    email = email.trim().toLowerCase();
    return this._db.collection<any>("mailing-list").doc(email).set({email: email, createdAt: new Date()});
  }
}
