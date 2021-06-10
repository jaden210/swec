import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LocationsDialog } from "../locations-dialog/locations-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { InfoDialog } from "../shared/info-dialog/info-dialog.component";

// TODO demo dots on first time use, favicon, letterhead;

@Injectable({ providedIn: "root" })
export class SignInService {
  public user: User;
  public userObservable = new BehaviorSubject<User>(null);
  public isAdmin: boolean;
  public locations: ILocation[];
  public location: ILocation;
  public locationObservable = new BehaviorSubject<ILocation>(null);
  public demoMode: boolean;
  constructor(
    private _firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private _dialog: MatDialog,
    private _snack: MatSnackBar,
    private _date: DatePipe
  ) {
    this._firebaseAuth.onAuthStateChanged((user) => {
      if (user && user.uid) {
        //this.setUser(user.uid);
        //this.setUsersLocations(user.uid);
        this.demoMode = false;
      }
    });
  }

  public async signIn(email: string, password: string): Promise<string> {
    return await this._firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(
        (res) => {
          if (res && res.user) {
            return res.user.uid;
          } else throw "An error occured, please try again later";
        },
        (error) => Promise.reject(`* ${error.message}`)
      );
  }

  public forgotPassword(email: string): Promise<any> {
    return this._firebaseAuth.sendPasswordResetEmail(email);
  }

  public async signup(
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

  public addUserToUserCollection(user: User): Promise<void> {
    return this.db.collection<User>("users").doc(user.id).set(user);
  }

  private setUsersLocations(userId: string): void {
    combineLatest([
      this.db
        .collection("locations", (ref) =>
          ref.where("admins", "array-contains", userId)
        )
        .snapshotChanges(),
      this.db
        .collection("locations", (ref) =>
          ref.where("users", "array-contains", userId)
        )
        .snapshotChanges(),
    ])
      .pipe(
        map(([actions1, actions2]) =>
          actions1.concat(actions2).map((action) => {
            const id = action.payload.doc.id;
            const data: any = action.payload.doc.data();
            const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null;
            return <ILocation>{ ...data, id, expiresAt };
          })
        )
      )
      .subscribe(
        (locations) => {
          // Remove duplicate results.
          locations = [...new Set(locations)];
          this.locations = locations;
          if (locations && locations.length) {
            if (locations.length === 1) this.setActiveLocation(locations[0]);
            else {
              const activeLocId = sessionStorage.getItem("locationId");
              const locMatch = locations.find((l) => l.id === activeLocId);
              if (locMatch) this.setActiveLocation(locMatch);
              else this.locationsDialog();
            }
          } else {
            this._dialog.open(InfoDialog, {
              data: {
                title: "Whoops! No Locations Found",
                body:
                  "We couldn't find any locations tied to your user account. Ask an admin to add you to thier team or Sign Up to create your own team.",
              },
            });
          }
          if (this.demoMode) {
            const loc = sessionStorage.getItem("demoLocation");
            if (loc) this.setActiveLocation(JSON.parse(loc));
          }
        },
        (error) => console.error(error)
      );
  }

  public setActiveLocation(location: ILocation): void {
    const locationAlreadySet =
      (location && location.id) == (this.location && this.location.id);
    this.location = location;
    this.locationObservable.next(location);
    this.isAdmin =
      this.user && location && location.admins.includes(this.user.id);
    // Don't run the health check on every update to the location doc.
    if (!locationAlreadySet) {
      sessionStorage.setItem("locationId", location ? location.id : null);
      this.runLocationHealthCheck();
    }
  }

  private runLocationHealthCheck(): void {
    if (
      this.location &&
      (this.location.inFreeTrial || this.location.lastPaymentFailed)
    ) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const today = new Date();
      const diffDays = Math.round(
        Math.abs((this.location.expiresAt.getTime() - today.getTime()) / oneDay)
      );
      if (this.location.inFreeTrial) {
        this._snack.open(
          `Your free trial expires in ${diffDays} days. Add billing information to your account before the free trial ends.`,
          "DISMISS"
        );
      }
      if (this.location.lastPaymentFailed) {
        this._snack.open(
          `Your last payment on ${this._date.transform(
            this.location.expiresAt
          )} failed. Please update your billing information`,
          "DISMISS"
        );
      }
    }
  }

  public locationsDialog(disableClose: boolean = true): void {
    this._dialog
      .open(LocationsDialog, { data: this.locations, disableClose })
      .afterClosed()
      .subscribe((location) => {
        if (location) {
          this.setActiveLocation(location);
        } else {
          this.setActiveLocation(this.location || this.locations[0]);
        }
      });
  }




}

export class User {
  email: string;
  name: string;
  disabledAt: Date;
  id: string;
}

export interface ILocation {
  createdAt: Date;
  disabledAt: Date | null;
  createdBy: string;
  locationName: string;
  expiresAt: Date;
  admins: string[];
  users: string[];
  stripeProfile: any;
  lastPaymentFailed: boolean;
  inFreeTrial: boolean;
  quoteCTAText: string | null;
  quoteCustomText: string | null;
  quoteBenefitText: string;
  quoteRebateText: string;
  quoteInnerMargin: number;
  quoteTaxExempt: boolean;
  quoteLetterheadUrl: string | null;
  quoteLetterheadScale: number;
  quoteLetterheadMarginLeft: number;
  quoteLetterheadMarginTop: number;
  id?: string;
}
