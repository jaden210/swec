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
}
