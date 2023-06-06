import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { trigger, transition, style, animate } from "@angular/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { HomeService } from "./home.service";
import { AppService, Quote } from "../app.service";
import { InfoDialog } from "../shared/info-dialog/info-dialog.component";
<<<<<<< HEAD
import { AngularFirestore } from "@angular/fire/firestore";
=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("250ms 500ms ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("250ms ease-in", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  public quotes: Quote[];
  public filteredQuotes: Quote[];
  public quote: Quote = new Quote();
<<<<<<< HEAD
  public gallery;
=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf

  constructor(
    private _dialog: MatDialog,
    public router: Router,
    private _route: ActivatedRoute,
    private _homeService: HomeService,
<<<<<<< HEAD
    private _appService: AppService,
    private _db: AngularFirestore
=======
    private _appService: AppService
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  ) {}

  /* Close login dialog on navigation to this component */
  ngOnInit() {
<<<<<<< HEAD
    this._db.collection("gallery", ref => ref.where("featured", "==", true)).valueChanges().subscribe(featured => {
      this.gallery = featured;
    })
=======
    
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  }

  public signUpContacts(phoneNumber) {
    if (phoneNumber) {
      var numberPattern = /\d+/g;
      let number = phoneNumber.match( numberPattern ).join([]);
      this._appService.addToContactList(number).then(() => {
        this._dialog.open(InfoDialog, {data: {
          title: "You're in!",
          body: "Keep an eye on your texts, we'll reach out to you soon."
        }});
      });
    }
  }

<<<<<<< HEAD

=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  public book() {
    this._appService.bookAppointment();
  }
}
