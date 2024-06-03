import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUrl: string = 'https://localhost:7291/api/Attendence';
  constructor(public http: HttpClient) { }
  getAttendance() {
    return this.http.get(this.baseUrl);
  }
  addAttendance(attendance: any) {
    return this.http.post(this.baseUrl, attendance);
  }
  getAttendanceById(id: any) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  editAttendance(id: any, attendance: any) {
    return this.http.put(`${this.baseUrl}/${id}`, attendance );
  }
  deleteAttendance(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getAttendanceBySearch(name: any, fromDate: any, toDate: any) {
    if(name==null){
      return this.http.get(`${this.baseUrl}/search?fromDate=${fromDate}&toDate=${toDate}`);
    }
    else if(fromDate==null){
      return this.http.get(`${this.baseUrl}/search?name=${name}`);
    }
     return this.http.get(`${this.baseUrl}/search?fromDate=${fromDate}&toDate=${toDate}&name=${name}`);
  }
  importexcel (file:any){
    return this.http.post(`${this.baseUrl}/import-excel`,file);
  }

}
