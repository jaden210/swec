import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private _auth: AngularFireAuth,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._auth.authState.subscribe(user => {
      if (user && user.uid) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
  }

  public logout(): void {
    this._auth.signOut().then(() => {
      this._router.navigate(["/home"]);
    });
  }

}
