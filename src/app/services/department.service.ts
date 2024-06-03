import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl: string = 'https://localhost:7291/api/Department';
  constructor(public http: HttpClient) { }
  getDepartments() {
    return this.http.get(this.baseUrl);
  }
  addDepartment(department: any) {
    return this.http.post(this.baseUrl, department);
  }
  getDepartmentById(id: any) {
    return this.http.get(`${this.baseUrl}/id?id=${id}`);
  }
}
