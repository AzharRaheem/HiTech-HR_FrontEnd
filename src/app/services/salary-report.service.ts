import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalaryReportService {
  baseUrl: string = 'https://localhost:7291/api/SalaryReport';
  constructor(public http: HttpClient) { }
  getSalaryReports() {
    return this.http.get(this.baseUrl);
  }
  getSalaryReportByName(name: any) {
    return this.http.get(`${this.baseUrl}/${name}`);
  }
  getSalaryReportByDate(year: any, month: any) {
    return this.http.get(`${this.baseUrl}/${year}/${month}`);
  }
  getSalaryReportByBoth(year: any, month: any, name: any) {
    return this.http.get(`${this.baseUrl}/BythreeEele?year=${year}&month=${month}&name=${name}`);
  }
}
