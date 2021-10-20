import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { take, finalize } from "rxjs/operators";
import { User } from "src/app/login/login.service";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  templateUrl: "./blackout-dialog.component.html",
  styleUrls: ["./blackout-dialog.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("250ms 500ms ease-out", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class BlackoutDialog {
  public loading: boolean;
  public error: string;
  public email: string;
  public type: string;
  public user: any;

  constructor(
    private _dialogRef: MatDialogRef<BlackoutDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {}

  ngOnInit() {
  
  }

  public close(should): void {
   this._dialogRef.close(should);
  }
}
