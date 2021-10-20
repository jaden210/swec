import { Component, OnInit } from "@angular/core";
import { SignInService, User } from "./login.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { trigger, transition, style, animate } from "@angular/animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("250ms 800ms ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("250ms ease-in", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoginDialogComponent implements OnInit {
  logo: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
  showResetPassword: boolean;
  public createAccountView: boolean;
  public userForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    password2: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private _signInService: SignInService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  public signIn(): void {
    this.error = !this.email
      ? "Your email address is required"
      : !this.password
      ? "Your password is required"
      : null;
    if (!this.error) {
      this.loading = true;
      this._signInService.signIn(this.email, this.password).then(
        (uid) => {
          if (uid) this.dialogRef.close(uid);
          this._router.navigate(["/admin"]);
        },
        (error) => {
          this.loading = false;
          console.error(error);
          if (
            error ==
            "* There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            this.error = "* This email does not exist in our database";
          } else if (
            (this.error =
              "* The password is invalid or the user does not have a password.")
          ) {
            this.error = "The password is invalid.";
            this.showResetPassword = true;
          } else this.error = error;
        }
      );
    }
  }

  public forgotPassword(): void {
    this._signInService
      .forgotPassword(this.email)
      .then(() =>
        this._snackBar.open(`Email sent to ${this.email}`, "", {
          duration: 5000,
        })
      )
      .catch((e) => {
        console.error(e);
        this.error = e;
      });
  }

  private creating: boolean;
  public createAccount(): void {
    const newUser = this.userForm.value;
    const password = newUser.password;
    this.error =
      password !== newUser.password2
        ? "Your passwords don't match"
        : password.length < 5
        ? "Your password must be at least 4 characters"
        : null;
    if (!this.error && !this.creating) {
      this.creating = true;
      this.loading = true;
      this._signInService.signup(newUser.email, password).then(
        (user: firebase.User) =>
          this.addUserToUserCollection(user, newUser.name),
        (error) => {
          this.error = error;
          this.creating = false;
          this.loading = false;
        }
      );
    }
  }

  private addUserToUserCollection(
    firebaseUser: firebase.User,
    name: string
  ): void {
    let user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      disabledAt: null,
    };
    this._signInService.addUserToUserCollection(user).then(
      () => {
        this.dialogRef.close(firebaseUser.uid);
        this._router.navigate(["/admin"]);
      },
      (error) => {
        console.error(error);
        this.error =
          "An error occured creating your account. Please try again.";
        this.loading = false;
      }
    );
  }

  public signUp(): void {
    this._router.navigate(["/sign-up"]);
    this.dialogRef.close();
  }
}
