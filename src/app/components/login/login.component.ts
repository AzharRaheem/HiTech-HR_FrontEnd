import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any;
  myerror: any;
  email: string = '';
  password: any ;
  showPassword: boolean = false;
  validationErrors: any = {};
  constructor(public userServies: LoginService, public router: Router) {

  }
  ngOnInit(): void {


  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle password visibility
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.setAttribute('type', this.showPassword ? 'text' : 'password');
    }
  }

  // emailFormatValidator(control: FormControl): { [key: string]: any } | null {
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   if (control.value && !emailPattern.test(control.value)) {
  //     return { 'invalidEmail': true };
  //   }
  //   return null;
  // }
  // Custom validator function for password format 
  // passwordFormatValidator(control: FormControl): { [key: string]: any } | null {
  //   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
  //   if (control.value && !passwordPattern.test(control.value)) {
  //     return { 'invalidPassword': true };
  //   }
  //   return null;
  // }

  loginForm = new FormGroup({

    email: new FormControl(null,
      [
        Validators.required,

      ]
    ),
    password: new FormControl('',
      [
        Validators.required,
    

      ]
    )
  });
  get getEmail() {
    return this.loginForm.controls['email'];
  }
  get getPassword() {
    return this.loginForm.controls['password'];
  }

  loginHandler(e: any) {
    e.preventDefault();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userServies.getlogin({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }).subscribe({
      next: data => {
        this.user = data;
        console.log(data);
        //Static 
        if (this.user.token) {
          localStorage.setItem('username', this.user.username)
          localStorage.setItem('token', this.user.token);
          localStorage.setItem('rolename', this.user.roleName);
          const roles = this.user.roles;
          const rolesString = JSON.stringify(roles);
          localStorage.setItem('roles', rolesString);
          this.router.navigate(['']);
        }

      },
      error: err => {
        if (err.error) {
          this.validationErrors = err.error;
          console.log(this.validationErrors);
        }
        this.myerror = err.error.message;
      }

    });
  }

}
