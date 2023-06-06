import { Component, Input } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title, Meta } from '@angular/platform-browser';
import { AppService } from "src/app/app.service";
import * as moment from "moment";
import { Appointment } from "src/app/appointment/appointment-sheet.service";
import { Expense } from "../admin.component";

@Component({
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
  selector: "dash"
})
export class DashComponent {
  @Input() public appointments: Appointment[] = [];
  @Input() public expenses: Expense[] = [];

  public currentYear: string;
  public lastYear: string;


  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private _db: AngularFirestore,
    private _appService: AppService
    ) {
      this.titleService.setTitle("Kokomo Spray Tans | dash");
      this.metaTagService.updateTag(
        { name: 'description', content: `
        Kokomo Spray Tans gives you the perfect glow for any occasion! Check out all these satisfied customers tans and book your appointment today` }
      );
    }

    ngOnInit() {
      this.currentYear = moment().year().toString();
      this.lastYear = moment().subtract(1, "y").year().toString();
      console.log(this.expenses);
      
    }

    public get CYAppointments(): number {
      return this.appointments.filter(a => moment(a.appointment.toDate()).isSame(moment(), 'y')).length || 0;
    }

    public get LYAppointments(): number {
      return this.appointments.filter(a => moment(a.appointment.toDate()).isSame(moment().subtract(1, 'y'), 'y')).length || 0;
    }

    public get CYSales(): number {
      return this.appointments.filter(a => moment(a.appointment.toDate()).isSame(moment(), 'y') && a.paid).map(a => a.paid).reduce((a,b) => a+b,0) || 0;
    }
    
    public get LYSales(): number {
      return this.appointments.filter(a => moment(a.appointment.toDate()).isSame(moment().subtract(1, 'y'), 'y') && a.paid).map(a => a.paid).reduce((a,b) => a+b,0) || 0;
    }
    
    public get Sales(): number {
      return this.appointments.filter(a => a.paid).map(a => a.paid).reduce((a,b) => a+b,0) || 0;
    }
    
    public get CYExpenses(): number {
      return -this.expenses.filter(e => moment(e.createdAt.toDate()).isSame(moment(), 'y')).map(e => e.amount).reduce((a,b) => a+b,0);
    }
    
    public get LYExpenses(): number {
      return -this.expenses.filter(e => moment(e.createdAt.toDate()).isSame(moment().subtract(1, 'y'), 'y')).map(e => e.amount).reduce((a,b) => a + b,0);
    }
    
    public get Expenses(): number {
      return -this.expenses.map(e => e.amount).reduce((a,b) => a + b, 0);
    }

    public get CYNet(): number {
      return this.CYSales + this.CYExpenses;
    }

    public get LYNet(): number {
      return this.LYSales + this.LYExpenses;
    }

    public get Net(): number {
      return this.Sales + this.Expenses;
    }
    
    public get Popularity(): any {
      let ar = [...new Set(this.appointments.map(a => a.name))].map(a =>({name:a,
        count:this.appointments.filter(n => n.name===a).length
      }));
      return ar.sort((a,b) => a.count > b.count ? -1 : 1).slice(0, 5);
    }
   
}

