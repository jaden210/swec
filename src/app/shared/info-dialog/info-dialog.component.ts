import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: "./info-dialog.component.html",
  styleUrls: []
})
export class InfoDialog {
  constructor(
    public dialogRef: MatDialogRef<InfoDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; body: string; button?: string }
  ) {}
}
