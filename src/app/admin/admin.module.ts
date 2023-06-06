import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AdminComponent } from "./admin.component";
import { AdminService } from "./admin.service";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
import { BlackoutDialog } from "./blackout-dialog/blackout-dialog.component";
import { ImageService } from "./image.service";
<<<<<<< HEAD
import { AdminAppointmentSheetComponent } from "../appointment-admin/admin-appointment-sheet.component";
import { DashComponent } from "./dash/dash.component";
=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
  },
];

@NgModule({
<<<<<<< HEAD
  declarations: [AdminComponent, EditImageComponent, ConfirmDialog, BlackoutDialog, AdminAppointmentSheetComponent, DashComponent],
=======
  declarations: [AdminComponent, EditImageComponent, ConfirmDialog, BlackoutDialog],
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [AdminService, ImageService],
})
export class AdminModule {}
