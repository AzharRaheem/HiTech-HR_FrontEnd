import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  baseUrl:string='https://localhost:7291/api/Auth';
  private jwtHelper = new JwtHelperService();
  
  constructor(public http: HttpClient, private router: Router) { // Inject Router
  }
  getAllusers(){
    return this.http.get(this.baseUrl);
  }

  getlogin(User: any){
    return this.http.post(`${this.baseUrl}/login`,User)

 }
 AddUser(User: any) {
  console.log(User);
  return this.http.post(`${this.baseUrl}`, User)
}

logOut(){
 
  localStorage.clear();
  this.router.navigateByUrl('/login');
}
IsLoggedIn(): boolean {
   let user = localStorage.getItem('token');
   return !this.jwtHelper.isTokenExpired(user);

}

}
