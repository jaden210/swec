import { Component } from "@angular/core";
import { AppService } from "../app.service";
import { BehaviorSubject } from "rxjs";
declare let gtag: Function;

@Component({
  selector: "footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  constructor(public appService: AppService) {}

  ngOnInit() {}
}
