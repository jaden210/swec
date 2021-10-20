import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { trigger, transition, style, animate } from "@angular/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { HomeService } from "./home.service";
import { AppService, Quote } from "../app.service";
import { InfoDialog } from "../shared/info-dialog/info-dialog.component";

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

  constructor(
    private _dialog: MatDialog,
    public router: Router,
    private _route: ActivatedRoute,
    private _homeService: HomeService,
    private _appService: AppService
  ) {}

  /* Close login dialog on navigation to this component */
  ngOnInit() {
    
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

  public book() {
    this._appService.bookAppointment();
  }
}
