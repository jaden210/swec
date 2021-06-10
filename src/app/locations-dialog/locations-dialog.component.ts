import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ILocation } from "src/app/login/login.service";

@Component({
  templateUrl: "./locations-dialog.component.html",
  styleUrls: ["./locations-dialog.component.scss"],
})
export class LocationsDialog {
  constructor(
    public dialogRef: MatDialogRef<LocationsDialog>,
    @Inject(MAT_DIALOG_DATA)
    public locations: ILocation[]
  ) {}
}
