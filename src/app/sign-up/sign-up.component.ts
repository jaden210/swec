import { Component } from "@angular/core";
import { SignInService, User } from "../login/login.service";
import { SignUpService } from "./sign-up.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent {
  public error: string;
  public loading: boolean;
  private creating: boolean;
  public accountForm: FormGroup = this._fb.group({
    name: [null, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(
    private _signUpService: SignUpService,
    private _fb: FormBuilder,
    private _router: Router,
    private _loginService: SignInService
  ) {}

  public createAccount(): void {
    const newAccount = this.accountForm.value;
    const password = newAccount.password;
    const email = newAccount.email;
    if (password && password.length < 5) {
      this.accountForm
        .get("password")
        .setErrors({ password: "Password must be at least 5 characters" });
    }
    if (!this.creating && this.accountForm.valid) {
      this.error = null;
      this.creating = true;
      this.loading = true;
      // Check if this email exists in our users collection.
      this.checkEmail(email).subscribe((users) => {
        if (users && users.length) {
          // If so, check that they can authenticate.
          this._loginService.signIn(email, password).then(
            () => {
              this._router.navigate(['/home']);
            },
            (error) => {
              this.loading = false;
              // This block is only executed if the auth user does not exist but a record in our
              // users collection does. This should technically be impossible.
              if (
                error ==
                "* There is no user record corresponding to this identifier. The user may have been deleted."
              ) {
                this._signUpService
                  .addAuthUser(email, password)
                  .then((user: firebase.User) => {
                    this._router.navigate(['/home']);
                  });
                // Incorrect password for an existing account.
              } else if (
                error ==
                "* The password is invalid or the user does not have a password."
              ) {
                this.creating = false;
                this.error = `We found an existing account for ${email}. The password provided is invalid.`;
              } else this.error = error;
            }
          );
        } else {
          this.addAuthUserAndCreateLocation(
            email,
            password,
            newAccount.name,
            newAccount.practice
          );
        }
      });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  private addAuthUserAndCreateLocation(
    email: string,
    password: string,
    name: string,
    practice: string
  ): void {
    this._signUpService.addAuthUser(email, password).then(
      (user: firebase.User) =>
        this.addUserToUserCollection(user, name).then(
          () => {
            this._router.navigate(['/home']);
          },
          (error) => {
            console.error(error);
            this.error =
              "An error occured creating your account. Please try again.";
            this.loading = false;
          }
        ),
      (error) => {
        this.error = error;
        this.creating = false;
        this.loading = false;
      }
    );
  }

  public checkEmail(email: string): Observable<User[]> {
    return this._signUpService.getUsersByEmail(email).pipe(take(1));
  }

  private async addUserToUserCollection(
    firebaseUser: firebase.User,
    name: string
  ): Promise<string> {
    let user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      disabledAt: null,
    };
    await this._signUpService.addUserToUserCollection(user);
    return user.id;
  }

  // The same user can create multiple locations.
  // private createLocation(practiceName: string, userId: string): void {
  //   this._signUpService.createLocation(practiceName, userId).subscribe(
  //     (r) => this._router.navigate(["/lenses"]),
  //     (e) => {
  //       console.error(e);
  //       alert("Error creating account. Please try again.");
  //     }
  //   );
  // }
}
