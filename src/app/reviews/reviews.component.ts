import { Component, OnInit, Inject } from "@angular/core";
import { ReviewsService, Review } from "./reviews.service";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
  providers: [ReviewsService]
})
export class ReviewsComponent implements OnInit {
  reviews: Review[];
  isLoggedIn: boolean = false;

  constructor(
    private reviewsService: ReviewsService,
    private _auth: AngularFireAuth,
    private dialog: MatDialog,
    private _router: Router
  ) {}

  ngOnInit() {
    this.reviewsService.getReviews().subscribe(reviews => {
      this.reviews = reviews;
    });
    this._auth.authState.subscribe(u => {
      if (u && u.uid) {
        this.isLoggedIn = true;
      }
    })
  }



  public addReview(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {
      data: {
        userId: this._auth.currentUser
          ? this._auth.currentUser
          : null
      }
    });
    dialogRef.afterClosed().subscribe(review => {
      if (review) {
        this.reviewsService.addReview(review);
      }
    });
  }

  public showReview(review: Review): void {
    this.dialog.open(ReviewExpandedDialog, {
      data: { review }
    });
  }
}

@Component({
  selector: "review-dialog",
  templateUrl: "review-dialog.html",
  styleUrls: ["./review-dialog.scss"]
})
export class ReviewDialog implements OnInit {
  public error: string;
  public rating: number;
  public name: string;
  public review: string;
  public done: boolean;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    
  }

  public saveReview(): void {
    this.error = !this.rating
      ? "A star rating is required"
      : !this.name
      ? "A name is required"
      : null;
    if (!this.error) {
      const review = new Review(
        this.name,
        this.review || null,
        this.rating
      );
      this.done = true;
      setTimeout(() => this.dialogRef.close(review), 2000);
    }
  }
}

@Component({
  selector: "review-expanded-dialog",
  templateUrl: "review-expanded-dialog.html",
  styleUrls: ["./review-expanded-dialog.scss"]
})
export class ReviewExpandedDialog implements OnInit {
  public review: Review;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.review = this.data.review;
  }
}
