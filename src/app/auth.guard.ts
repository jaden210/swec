import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialogComponent } from "./login/login.component";
import { map, take, flatMap, tap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _auth: AngularFireAuth
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.authState.pipe(
      take(1),
      flatMap((authState) => {
        return !authState
          ? this._dialog
              .open(LoginDialogComponent, { width: "300px" })
              .afterClosed()
              .pipe(map((uid) => (uid ? true : false)))
          : of(true);
      }),
      tap((authorized) => {
        if (!authorized) this._router.navigate(["home"]);
      })
    );
  }
}
