
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/User';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  userRegister: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseErrorService,
    private userService: UserService,

  ) {
    this.userRegister = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  register(): Observable<User> {
    const name = this.userRegister.value.name;
    const email = this.userRegister.value.email;
    const password = this.userRegister.value.password;
    const repeatPassword = this.userRegister.value.repeatPassword;
    const user : User = (this.userRegister.value.name, this.userRegister.value.email, this.userRegister.value.password);

    if (password !== repeatPassword) {
      this.toastr.error('Password must be equals', 'Error');

    }
    this.loading = true;
    this.loading = false;
     return this.userService.registerUser(user);
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
  //   const name = this.userRegister.value.name;
  //   const email = this.userRegister.value.email;
  //   const password = this.userRegister.value.password;
  //   const repeatPassword = this.userRegister.value.repeatPassword;

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
