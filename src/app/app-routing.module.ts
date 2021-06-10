import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { HomeComponent } from "./home/home.component";
import { PricingComponent } from "./pricing/pricing.component";

// Order matters here, first match wins
const appRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "pricing",
    component: PricingComponent,
  },
  {
    path: "faq",
    loadChildren: () => import("./faq/faq.module").then((m) => m.FaqModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
      canActivate: [AuthGuard],
  },
  // {
  //   path: "sign-up",
  //   loadChildren: () =>
  //     import("./sign-up/sign-up.module").then((m) => m.SignUpModule),
  // },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "**",
    loadChildren: () =>
      import("./page-not-found/page-not-found.module").then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
