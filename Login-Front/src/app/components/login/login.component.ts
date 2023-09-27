import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { LoginService } from 'src/app/services/login.service';
import { catchError, EMPTY, finalize, Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from 'src/app/interfaces/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {


  destroyed$ = new Subject<boolean>()
  userLoginForm: UntypedFormGroup = this.fb.group({

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

  });
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseErrorService,
    private loginService: LoginService,
  ) {

  }


  ngOnInit(): void {}

  // ngOnDestroy(): void {
  //   this.destroyed$.next(true);
  //   this.destroyed$.complete();
  // }

  login() {

    this.loading = true;
    const user = this.userLoginForm.value;

    this.loading = true;
    this.loginService.login(user).pipe(
      takeUntil(this.destroyed$),
      catchError((err) => {
        console.log(err);
        this.toastr.error(`Error login the user`, 'Error');
        return EMPTY;
      }),
      finalize(() => this.loading = false)
    ).subscribe(async (user: User) => {

       this.toastr.success(`User ${user.name} Login Successfully`, 'Success');
       this.router.navigate(['/dashboard']);
      }
    )



    // this.afAuth
    //   .signInWithEmailAndPassword(email, password)
    //   .then((user) => {
    //     console.log(user);
    //     if (user.user?.emailVerified) {
    //       this.router.navigate(['/dashboard']);
    //     } else {
    //       this.router.navigate(['/validate-email']);
    //     }
    //   })
    //   .catch((error) => {
    //     this.loading = false;
    //     this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    //   });
  }
}
