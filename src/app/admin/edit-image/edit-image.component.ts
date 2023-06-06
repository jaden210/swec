import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdminService } from "../admin.service";

@Component({
  selector: "app-edit-image",
  templateUrl: "./edit-image.component.html",
  styleUrls: ["./edit-image.component.css"],
})
export class EditImageComponent implements OnInit {


  constructor(
    private _imageService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<EditImageComponent>
  ) {}

  ngOnInit() {
  
  }


  public close(action: string = null): void {
    this.dialogRef.close({action: action, href: this.data.href});
  }
}

export interface DialogData {
  href: string;
  imageUrl: string;
}
