import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any;
  loading: boolean = false;

  constructor(public x: EmployeesService, public router: Router, public encryptionService: EncryptionService) { }

  ngOnInit(): void {
    this.loading = true;
    this.employees = this.x.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        console.log(this.employees);
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  deleteEmployeeHandler(id: any) {
    // Display SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'Once deleted, you will not be able to recover data',
      iconHtml: '<i class="bi bi-trash text-danger"></i>', // Custom icon HTML
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#036088',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with deletion
        this.x.deleteEmployee(id).subscribe({
          next: () => {
            // Remove the deleted employee from the employees array
            this.employees = this.employees.filter(
              (employee: any) => employee.nationalID != id
            );
            // Show success message using SweetAlert
            Swal.fire('Employee Record deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
            // Show error message using SweetAlert
            Swal.fire('Error!', 'An error occurred while deleting the employee', 'error');
          },
        });
      }
    });
  }
  sweet() {
    Swal.fire({
      title: "Don't have permission",
      text: "You don't have permission to access this page.",
      icon: 'warning',// Replace with your custom HTML icon
      timer: 1600,
      showConfirmButton: false,
      position: 'top'
    });


  }

  navigateToDetails(id: number): void {


    const encryptedId = this.encryptionService.encryptData(id);
    this.router.navigate(['/employeedetails', encryptedId]);
  }
  onClickUpdate(id: any): any {
    const rolesString = localStorage.getItem('roles');
    if (rolesString != null) {
      const rolesArray = JSON.parse(rolesString);
      for (const role of rolesArray) {
        if (role == 'Employee.Update' || role == 'Admin') {
          const encryptedId = this.encryptionService.encryptData(id);
          this.router.navigate(['/employee', encryptedId, 'edit'])

          return true;
        }
      }

      this.sweet()
      return false;

    }
  }

  onClickDelete(id: any): any {
    const rolesString = localStorage.getItem('roles');
    if (rolesString != null) {
      const rolesArray = JSON.parse(rolesString);
      for (const role of rolesArray) {
        if (role == 'Employee.Delete' || role == 'Admin') {
          this.deleteEmployeeHandler(id);
          return true;
        }
      }

      this.sweet()
      return false;

    }
  }
  fileSelection(event:any):void{
    const formDate=new FormData();
    formDate.append('file', event.target.files[0]);
      this.x.importexcel(formDate).subscribe(data=>{
       console.log(data);
      });
      window.location.reload();
 }
}
