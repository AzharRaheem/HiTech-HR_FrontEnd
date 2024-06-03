import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl:string="https://localhost:7291/api/RoleName";
  constructor(public http:HttpClient) { }
  addRole(name:any){
    return this.http.post(this.baseUrl,name)
  }
  getAll(){
    return this.http.get(this.baseUrl)
  }
  getById(id:any){
    return this.http.get(`${this.baseUrl}/${id}`)
  }
}
