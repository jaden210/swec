import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { ActivatedRoute, Router } from '@angular/router';
=======
import { ActivatedRoute } from '@angular/router';
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
import { AppService } from '../app.service';
import { Appointment } from '../appointment/appointment-sheet.service';
import * as moment from "moment";

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  appointment: Appointment = new Appointment();
  public smsBody;
<<<<<<< HEAD
  postBody: string = `Post Tan: 
  1. Avoid moisture until your initial rinse. This means no showers, working out, lotions, or liquid foundations on this skin. Stay in a cool place to avoid any sweating. If you have pets, do not let them lick you! 🐩 
  2. If you got a classic tan rinse in 8-12 hours. If you got a rapid tan rinse in 2-4 hours depending on your desired darkened level. Do not over process. Rinse with lukewarm water and do not use any product/soap. 🚿 You will see the bronzer wash down the drain. Pat yourself dry, don’t rub. 
  3. The classic tan will be fully developed post rinse and you may moisturizer after. The rapid will take and additional 12-24 hours to fully develop post rinse. If you received a rapid then wait until the next day to moisturize after your tan has fully developed.
  4. Apply moisturizer morning and night after full development of your tan that is free to mineral oil and alcohols. Hempz, Shea Moisturizer, CeraVe, Alba, and Cetaphil are a few tan friendly lotions! 
  5. To preserve your tan avoid swimming, long hot showers/baths, saunas, and excessive sweating.
  6. Do not exfoliate until your tan is at the tail end of its life.
  
  Thanks for coming in!! 😊☀️
  
  -Madi/Kokomo Spray Tans 🥥 `;

  prepBody: string = `Please follow these prep instructions prior to your appointment: 

  1. Complete all other beauty services prior to your appointment. (Pedicures, manicures, massages, waxing/laser hair removal, facials, etc.) 💅🏽 
  2. Shower with a gel-based body wash, shave any unwanted body hair and exfoliate thoroughly at least 4 hours prior to your appointment. If you can only shower right before your appointment, finish with a cold rinse to close up pores. Do not use any Dove products or body wash that contains extra moisturizers. 🧼 
  3. Arrive to your appointment free of any deodorant, perfume, moisturizers, oils, or  makeup💄as these products will act as a barrier between your tan and your skin.
  4. Wear dark, loose clothing, and open toed sandals to your appointment. No denim, yoga pants, bras, etc. Please note that the bronzer in the solution may transfer to your items, but is water soluble 💦 and will wash out.
  5. Women may tan however they feel most comfortable. Men must wear undergarments. Disposable underwear available upon request 
  
  Please note: You will not be able to get wet for 8-12 hours after a classic tan. Rapid tans can be rinsed off after 2-4 hours depending how dark you would like your tan. 
  
  Classic Tans - $25 
  Rapid Tans - $35 
  Partial Tans - $12 
  
  ***Failure to follow prep instructions may cause splotching, streaking, and/or discoloration.***
   
  Park in the driveway if possible. 
  I accept cash (preferred) or Venmo! 
  
  Please let me know if you have any questions! 🖤 
  ☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️
  
  Madi Martin
  Kokomo Spray Tans
  (559) 977-3538
  Address: 1528 N Overland Trails Dr, Washington UT 84780`;

  smsBodies = [
    {name: "send prep instructions", body: encodeURIComponent(this.prepBody)},
    {name: "send post instructions", body: encodeURIComponent(this.postBody)},
    {name: "start a blank text", body: ``},
    {name: "copy prep instructions and open instagram", body: this.prepBody, social: true},
    {name: "copy post instructions and open instagram", body: this.postBody, social: true},
    {name: "open instagram", body: ``, social: true},
  ];


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
=======

  constructor(
    private _route: ActivatedRoute,
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
    private _appService: AppService
  ) { }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params:any) => {
      this._appService.getAppointment(params.params.id).subscribe((appointment: Appointment) => {
        this.appointment = appointment;
        this.appointment.appointment = moment(this.appointment.appointment.toDate()).format("dddd, MMMM Do YYYY, h:mm a");
<<<<<<< HEAD
=======
        this.smsBody = `sms://+1${appointment.number}?&body=Hey%2C%0AJust%20wanted%20to%20let%20you%20know%20that%20I%20received%20your%20appointment%20for%20${appointment.appointment}.%20For%20pre%20tan%20instructions%2C%20see%20my%20site%3A%20https%3A%2F%2Fkokomosprays.com%2Fprep`
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
      });
    });
  }

<<<<<<< HEAD
  public popSMS(index): void {
    let message = this.smsBodies[index];
    if (message.social) {
      const selBox = document.createElement("textarea");
      selBox.style.position = "fixed";
      selBox.style.left = "0";
      selBox.style.top = "0";
      selBox.style.opacity = "0";
      selBox.value = message.body;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand("copy");
      document.body.removeChild(selBox);
      window.open(`https://instagram.com/${this.appointment.ig}`);
    } else {
      window.open(`sms://+1${this.appointment.number}?&body=${message.body}`);
    }
  }

  public navContact(): void {
    this._router.navigate([`contact`])
  }



=======
>>>>>>> 575ff04f8f7e4600b3c6b65a2b1d68d758b779cf
}
