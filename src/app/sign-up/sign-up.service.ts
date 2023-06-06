import { Injectable, Inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/functions";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../login/login.service";

@Injectable({ providedIn: "root" })
export class SignUpService {
  constructor(
    private _firebaseAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  public getUsersByEmail(email: string): Observable<User[]> {
    return this.db
      .collection("users", (ref) =>
        ref.where("email", "==", email.toLowerCase())
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  public addUserToUserCollection(user: User): Promise<void> {
    return this.db.collection<User>("users").doc(user.id).set(user);
  }


  public async addAuthUser(
    email: string,
    password: string
  ): Promise<string | firebase.User> {
    return await this._firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (data) => data.user,
        (error) => Promise.reject(`* ${error.message}`)
      );
  }
}
