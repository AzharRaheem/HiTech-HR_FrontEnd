import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(public http: HttpClient) { }
  baseUrl = "https://localhost:7291/api/Employee";
  getAllEmployees() {
    return this.http.get(this.baseUrl);
  }
  getEmployee(id: any) {
    return this.http.get(`${this.baseUrl}/id?id=${id}`);
  }
  deleteEmployee(id: any) {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }
  AddEmployee(employee:any)
  {
    return this.http.post(this.baseUrl,employee);
  }
  editEmployee(employee: any) {
    return this.http.put(`${this.baseUrl}`, employee);
  }
  importexcel(file:any){
    return this.http.post(`${this.baseUrl}/import-excel`,file);
  }
 
}

