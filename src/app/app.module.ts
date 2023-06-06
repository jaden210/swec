import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { environment } from "src/environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { LoginDialogComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { LocationsDialog } from "./locations-dialog/locations-dialog.component";
import { DatePipe } from "@angular/common";
import { PricingComponent } from "./pricing/pricing.component";
import { AppointmentSheetComponent } from "./appointment/appointment-sheet.component";
import { AboutComponent } from "./about/about.component";
import { SmsComponent } from "./sms/sms.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { GalleryComponent } from "./gallery/gallery.component";
<<<<<<< HEAD
import { ContactComponent } from "./contact/contact.component";
=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf

@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    HomeComponent,
    LocationsDialog,
    PricingComponent,
    AppointmentSheetComponent,
    AboutComponent,
    SmsComponent,
    ContactsComponent,
<<<<<<< HEAD
    ContactComponent,
=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    SharedModule.forRoot(),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
