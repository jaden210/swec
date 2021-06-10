import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AdminComponent } from "./admin.component";
import { AdminService } from "./admin.service";
import { EditImageComponent } from "./edit-image/edit-image.component";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
  },
];

@NgModule({
  declarations: [AdminComponent, EditImageComponent, ConfirmDialog],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [AdminService],
})
export class AdminModule {}
