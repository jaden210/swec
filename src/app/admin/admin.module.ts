import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AdminComponent } from "./admin.component";
import { AdminService } from "./admin.service";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
import { BlackoutDialog } from "./blackout-dialog/blackout-dialog.component";
import { ImageService } from "./image.service";
import { AdminAppointmentSheetComponent } from "../appointment-admin/admin-appointment-sheet.component";
import { DashComponent } from "./dash/dash.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
  },
];

@NgModule({
  declarations: [AdminComponent, EditImageComponent, ConfirmDialog, BlackoutDialog, AdminAppointmentSheetComponent, DashComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [AdminService, ImageService],
})
export class AdminModule {}
