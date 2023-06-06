import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";
import { map, catchError, takeLast, flatMap } from "rxjs/operators";
import * as firebase from "firebase/app";
import "firebase/auth";
import { ILocation, SignInService, User } from "../login/login.service";
import { Appointment, Blackout } from "../appointment/appointment-sheet.service";
import { Expense } from "./admin.component";

@Injectable()
export class AdminService {
  constructor(
    public db: AngularFirestore,
    private auth: AngularFireAuth,
    public storage: AngularFireStorage,
    public router: Router,
    private _signInService: SignInService,
    private _storage: AngularFireStorage
  ) {}

  public getExpenses(): Observable<Expense[]> {
    return this.db.collection<Expense>("expenses", ref => ref.orderBy("createdAt", "desc")).valueChanges({ idField: "id" });
  }

  public getAvailability(): Observable<any> {
    return this.db.collection("availability").valueChanges();
  }

  public getBlackouts(): Observable<any> {
    return this.db.collection("blackouts").valueChanges();
  }

  public getGallery(): Observable<any> {
    return this.db.collection("gallery").valueChanges({idField: "id"});
  }

  public addImage(data) {
    return this.db.collection("gallery").add(data);
  }

  public updateImage(data) {
    return this.db.doc(`gallery/${data.id}`).set(data);
  }

  public removeImage(data) {
    return this.db.doc(`gallery/${data.id}`).delete();
  }
  
<<<<<<< HEAD
  public createBlackout(blackout: Blackout): Promise<any> {
    return this.db
      .collection(`blackouts`)
      .add({ ...blackout });
  }
=======
    public createBlackout(blackout: Blackout): Promise<any> {
      return this.db
        .collection(`blackouts`)
        .add({ ...blackout });
    }
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf

  public updateAppointment(appointment: Appointment): Promise<any> {
    return this.db
      .collection("appointments")
      .doc(appointment.id)
      .update({ ...appointment });
  }

  public deleteAppointment(appointment: Appointment): Promise<any> {
    return this.db
      .collection(`appointments`)
      .doc(appointment.id)
      .delete();
  }

  public updateExpense(expense: Expense): Promise<any> {
    return this.db
      .collection(`expenses`)
      .doc(expense.id)
      .update({ ...expense });
  }

  public deleteExpense(expense: Expense): Promise<any> {
    return this.db
      .collection(`expenses`)
      .doc(expense.id)
      .delete();
  }

  public createExpense(expense: Expense): Promise<any> {
    expense.createdAt = new Date();
    return this.db
      .collection(`expenses`)
      .add({ ...expense });
  }










  public getItems(): Observable<Item[]> {
    return this.db.collection<Item>(`items`, ref => ref.orderBy("order", "asc")).valueChanges({ idField: "id" });
  }


  public createCategory(category: Category): Promise<string> {
    return this.db
      .collection("collections")
      .add({ ...category }).then(snap => {
        return snap.id;
      });
  }
  



  public uploadImage(file: any): Observable<any> {
    let filePath = `main-item/id-${Math.random().toString(36).substr(2, 16)}`;
    let ref = this._storage.ref(filePath);
    let task = this._storage.upload(filePath, file);
    return task.snapshotChanges().pipe(
      takeLast(1),
      flatMap(() => ref.getDownloadURL()),
      catchError(error => {
        console.error(`Error saving image. ${error}`);
        return throwError(error);
      })
    );
  }

}



export class Category {
  id: string;
  name: string;
  displayType: DisplayType = DisplayType.list;
  description: string;
  order: any;

  items?: Item[]; //readonly
  item?: Item; //readonly
}

export class Item {
  id: string;
  categoryId: string;
  name: string;
  order: any;
  description: string;
  imageUrl?: string;
  media?: any = [];
  price?: number;
  filterItems: string[] = [];
}

export enum DisplayType {
  list = "List",
  grid = "Grid",
  detail = "Detail"
}

export class Gallery {

}

export enum ObjectFit {
  COVER = "cover",
  CONTAIN = "contain",
}