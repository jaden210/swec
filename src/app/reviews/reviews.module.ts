import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";
import { SharedModule } from "../shared/shared.module";

import {
  ReviewsComponent,
  ReviewDialog,
  ReviewExpandedDialog
} from "./reviews.component";

const routes: Routes = [
  {
    path: "",
    component: ReviewsComponent
  }
];

@NgModule({
  imports: [FormsModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ReviewsComponent, ReviewDialog, ReviewExpandedDialog],
  entryComponents: [ReviewDialog, ReviewExpandedDialog]
})
export class ReviewsModule {}
