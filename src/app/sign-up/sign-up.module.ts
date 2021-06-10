import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { SignUpComponent } from "./sign-up.component";
import { SignUpService } from "./sign-up.service";

const routes: Routes = [
  {
    path: "",
    component: SignUpComponent,
  },
];

@NgModule({
  declarations: [SignUpComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [SignUpService],
})
export class SignUpModule {}
