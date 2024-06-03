import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  rolesName: any[] = [];
  roledata:any;
  name:any;
  disabledbtn:boolean=true;
  usernameuser:any;
  fullnameuser:any;
  passworduser:any;
  emailuser:any;
  roleuser:any;
  user:any;
  errorRegister:any;
  showPassword: boolean = false
    constructor(public userService: LoginService, public router: Router , public role: RoleService){

  }
  ngOnInit(): void {
   
    this.role.getRole().subscribe({
      next:data=>{
        this.roledata=data;
        console.log(this.roledata);
        // this.roledata.forEach((ele: any) => {
        //   this.name=ele.groupName;
        //   this.rolesName.push(this.name);
        // });
       if (this.roledata.length==0){
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Please enter a role first!',
        });
        this.router.navigate(['/permissions']);
       }
       
      }
                    
    })
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle password visibility
    const passwordInput = document.getElementById('passworduser');
    if (passwordInput) {
      passwordInput.setAttribute('type', this.showPassword ? 'text' : 'password');
    }
  }

    nameFormatValidator(control: FormControl): { [key: string]: any } | null {
      const namePattern = /^[^\d]+$/;
      if (control.value && !namePattern.test(control.value)) {
        return { 'invalidName': true };
      }
      return null;
    }

   
    emailFormatValidator(control: FormControl): { [key: string]: any } | null {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (control.value && !emailPattern.test(control.value)) {
        return { 'invalidEmail': true };
      }
      return null;
    } 
    passwordFormatValidator(control: FormControl): { [key: string]: any } | null {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
      if (control.value && !passwordPattern.test(control.value)) {
        return { 'invalidPassword': true };
      }
      return null;
    }
  registerForm = new FormGroup({

    fullName: new FormControl('',
      [
        Validators.required,
        this.nameFormatValidator,
      ]
    ),
    email: new FormControl(null,
      [
        Validators.required,
        this.emailFormatValidator
      ]
    ),
    username: new FormControl('',
      [
        Validators.required
      ]
    ),
    password: new FormControl('',
      [
        Validators.required,
        this.passwordFormatValidator,
      ]
    ),
    roleid: new FormControl('', [ Validators.required, ]),
  });
  get getName() {
    return this.registerForm.controls['fullName'];
  }
  get getEmail() {
    return this.registerForm.controls['email'];
  }
  get getuserName() {
    return this.registerForm.controls['username'];
  }
  get getRole() {
   return this.registerForm.controls['roleid'];
  }
  get getPassword() {
    return this.registerForm.controls['password'];
  }
  
  hasUpperCase(): boolean {
    const value = this.getPassword.value;
    if (value === null || value === undefined) {
      return false;
    }
    return /[A-Z]/.test(value.toString());
  }
  
  hasLowerCase(): boolean {
    const value = this.getPassword.value;
    if (value === null || value === undefined) {
      return false;
    }
    return /[a-z]/.test(value.toString());
  }
  
  hasDigit(): boolean {
    const value = this.getPassword.value;
    if (value === null || value === undefined) {
      return false;
    }
    return /\d/.test(value.toString());
  }
  
  hasSpecialChar(): boolean {
    const value = this.getPassword.value;
    if (value === null || value === undefined) {
      return false;
    }
    return /[@$!%*?&]/.test(value.toString());
  }
  
  isLengthValid(): boolean {
    const value = this.getPassword.value;
    if (value === null || value === undefined) {
      return false;
    }
    return value.toString().length >= 8;
  }
  
  
  adduser(e:any){
    e.preventDefault();
    if(this.registerForm.status == 'VALID'){
      console.log(this.registerForm.value +' successfully');
      this.userService.AddUser(this.registerForm.value).subscribe({
        next:data=>{
          this.user=data;
          console.log(this.user);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'User added successfully!'
          });
          this.router.navigate(['/allUsers']);
        }
        ,
        error: (error) => {
          this.errorRegister=error.error;
          console.log(error)
        },
      })
     
    }
  }

}
