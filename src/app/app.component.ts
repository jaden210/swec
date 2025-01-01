import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AppService } from "./app.service";
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private _dialog: MatDialog,
    private _appService: AppService, 
    private _titleService: Title, 
    private _metaTagService: Meta
    ) {}

  ngOnInit() {
    this._titleService.setTitle("swec Spray Tans");
    this._metaTagService.addTags([
      { name: 'keywords', content: 'swec Spray Tans' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'swec Spray Tans' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2021-06-13', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ]);
  }
}
