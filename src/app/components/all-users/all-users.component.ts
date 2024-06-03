import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { SalaryReportService } from 'src/app/services/salary-report.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  userReports: any;
  disablesSearch: boolean = true;
  tableLoading: boolean = false;
  constructor(public userServices: LoginService) {

  }
  ngOnInit(): void {
    this.tableLoading = true;
    this.userServices.getAllusers().subscribe({
      next: data => {
        this.userReports = data;
        this.tableLoading = false;
      }
    })
  }


}
