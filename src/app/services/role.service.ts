
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(public http: HttpClient) { }
  baseUrl: string = 'https://localhost:7291/api/RoleName/';
  getRole(){
    return this.http.get(this.baseUrl+"GetAllRoles");
  }
  getById(id:any){
    return this.http.get(`${this.baseUrl}GetGroupById/${id}`)
  }
  addRole(role: any){

    return this.http.post(`${this.baseUrl}CreateRole`,role);
  }

  updateRole(role:any,id:any){
    return this.http.put(`${this.baseUrl}UpdateRole/${id}`,role);
  }
  getByName(name:any){
    return this.http.get(`${this.baseUrl}GetByName/${name}`)
  }
}
