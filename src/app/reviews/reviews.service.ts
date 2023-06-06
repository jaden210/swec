import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { map, catchError } from "rxjs/operators";
import "firebase/auth";

@Injectable()
export class ReviewsService {
  constructor(public db: AngularFirestore, public router: Router) {}

  public getReviews(): Observable<Review[]> {
    return this.db
      .collection("reviews", ref => ref.orderBy("createdAt", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a: any) => {
            const data = <any>a.payload.doc.data();
            const id = a.payload.doc.id;
            const createdAt = data.createdAt ? data.createdAt.toDate() : null;
            return <Review>{
              ...data,
              id,
              createdAt,
            };
          })
        ),
        catchError((e) => {
          console.error(e);
          throw e;
        })
      );
  }

  public addReview(review: Review): Promise<any> {
    return this.db.collection("reviews").add({ ...review });
  }
}

export class Review {
  createdAt: Date;
  constructor(
    public name: string,
    public review: string,
    public rating: number
  ) {
    this.createdAt = new Date();
  }
}
