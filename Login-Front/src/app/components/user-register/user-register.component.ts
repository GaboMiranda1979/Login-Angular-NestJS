import { Component, Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/User';
import { catchError, EMPTY, finalize, Observable, Subject, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>()
  registerForm: UntypedFormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword: ['', Validators.required],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseErrorService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  register() {
    const password = this.registerForm.value.password;
    const repeatPassword = this.registerForm.value.repeatPassword;

    if (password !== repeatPassword) {
      this.toastr.error('Password must be equals', 'Error');
    }

    const user = this.registerForm.value;
    delete user.repeatPassword;
    this.loading = true;
    this.userService.registerUser(user).pipe(
      takeUntil(this.destroyed$),
      catchError((err) => {
        console.log(err);
        this.toastr.error(`Error while creating the user`, 'Error');
        return EMPTY;
      }),
      finalize(() => this.loading = false)
    ).subscribe((user: User) => {
        this.toastr.success(`User ${user.name} registered Successfully`, 'Success');
      }
    )
    // this.validateEmail();
    // this.toastr.success('User Registered Successfully', 'Success');
    // this.router.navigate(['/login']);
    // })
    // catch((error: { code: string; }) => {
    //   this.loading = false;
    //   this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    // });
  }

  // register() {
  //   const name = this.registerForm.value.name;
  //   const email = this.registerForm.value.email;
  //   const password = this.registerForm.value.password;
  //   const repeatPassword = this.registerForm.value.repeatPassword;

  //   if (password !== repeatPassword) {
  //     this.toastr.error('Password must be equals', 'Error');
  //     return;
  //   }
  //   this.loading = true;
  //   this.afAuth
  //     .createUserWithEmailAndPassword( email, password)
  //     .then(() => {
  //       this.loading = false;
  //       this.validateEmail();
  //       // this.toastr.success('User Registered Successfully', 'Success');
  //       // this.router.navigate(['/login']);
  //     })
  //     .catch((error) => {
  //       this.loading = false;
  //       this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
  //     });
  // }

  validateEmail() {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.toastr.success(
          'We send you an email to validate it',
          'Validate Email'
        );
        this.router.navigate(['/login']);
      });
  }
}
