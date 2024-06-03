import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: any;
  employee: any;
  department: any;
  decryptId:any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public employeeService: EmployeesService,
    public router: Router,
    public departmentService: DepartmentService,
    public encryptionService:EncryptionService
  ) {}

  ngOnInit(): void {
    const encryptId=this.activatedRoute.snapshot.params['id'];
    this.decryptId=this.encryptionService.decryptData(encryptId); 
    this.employeeId = this.decryptId;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (data: any) => {
        this.employee = data;
        this.loadDepartment(data.idDept);
      },
      error: (error: any) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }

  loadDepartment(departmentId: any) {
    this.departmentService.getDepartmentById(departmentId).subscribe({
      next: (data: any) => {
        this.department = data.name; 
      },
      error: (error: any) => {
        console.error('Error fetching department data:', error);
      }
    });
  }
}
