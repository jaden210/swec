import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { AuthGuard } from "./auth.guard";
import { ContactComponent } from "./contact/contact.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { HomeComponent } from "./home/home.component";
import { PricingComponent } from "./pricing/pricing.component";
import { SmsComponent } from "./sms/sms.component";

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
    path: "about",
    component: AboutComponent,
  },
  {
    path: "gallery",
    component: GalleryComponent,
  },
  {path: 'sms', component: SmsComponent, canActivate: [AuthGuard]},
  {path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
  {path: 'contact', component: ContactComponent, canActivate: [AuthGuard]},
  {
    path: "faq",
    loadChildren: () => import("./faq/faq.module").then((m) => m.FaqModule),
  },
  {
    path: "prep",
    loadChildren: () => import("./prep/prep.module").then((m) => m.PrepModule),
  },
  {
    path: "complete",
    loadChildren: () => import("./prep/prep.module").then((m) => m.PrepModule),
  },
  {
    path: "post",
    loadChildren: () => import("./post/post.module").then((m) => m.PostModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
      canActivate: [AuthGuard],
  },
  {
    path: "reviews",
    loadChildren: () =>
      import("./reviews/reviews.module").then((m) => m.ReviewsModule)
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
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
