import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { PageNotFoundComponent } from "./page-not-found.component";

const routes: Routes = [
  {
    path: "",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [FormsModule, RouterModule.forChild(routes), SharedModule],
  declarations: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
