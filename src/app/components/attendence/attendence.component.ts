import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { EncryptionService } from 'src/app/services/encryption.service';
@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {
  attendences: any;
  tableLoading: boolean = false;
  disablesSearch: boolean = true;
  Search: any;
  name: any;
  fromDate: any;
  toDate: any;

  constructor(public x: AttendanceService, public router: Router,public encryptionService:EncryptionService) { }
  


  
  ngOnInit(): void {
    this.tableLoading = true;
    this.attendences = this.x.getAttendance().subscribe({
      next: (data) => {
        this.attendences = data;
        this.tableLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  enabledSearch() {
    console.log(this.fromDate)
    console.log(this.toDate)
    if ((this.Search && this.Search != '') || (this.fromDate != undefined && this.toDate != undefined)) {
      this.disablesSearch = false;
    } else {
      this.disablesSearch = true;
    }
  }

  search() {
    this.tableLoading = true;
    if (this.Search == '') {
      this.Search = null;
    }
    if (this.fromDate == undefined || this.toDate == undefined) {
      this.fromDate = null;
      this.toDate = null;
    }
    this.x.getAttendanceBySearch(this.Search, this.fromDate, this.toDate).subscribe({
      next: data => {
        this.attendences = data;
        this.tableLoading = false;
        console.log(data)
      },
      error: e => {
        this.tableLoading = false;
        this.attendences = [];
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The date you enter is invalid",
        });
      }
    });


  }


  deleteAttendanceHandler(id: any) {
    // Display SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'Once deleted, you will not be able to recover data',
      icon: 'warning', // Custom icon HTML
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#036088',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with deletion
        this.x.deleteAttendance(id).subscribe({
          next: () => {
            // Remove the deleted attendence from the attendence array
            this.attendences = this.attendences.filter(
              (attendence: any) => attendence.id != id
            );
            // Show success message using SweetAlert
            Swal.fire('Attendance Record deleted Successfully', '', 'success');
          },
          error: (error) => {
            console.log(error);
            // Show error message using SweetAlert
            Swal.fire('Error!', 'An error occurred while deleting the attendance', 'error');
          },
        });
      }
    });
  }
  downloadTable() {
   
    Swal.fire({
      title: "Are you sure?",
      text: "You Will Download it",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Download it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let data = document.getElementById("attendneceTable");
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Attendence Report.xlsx');
  
        Swal.fire({
          title: "Downloaded!",
          text: "Your Sheet has been Downloaded.",
          icon: "success"
        });
      }
    });

  }
  sweet(){
    Swal.fire({
      title: "Don't have permission",
      text: "You don't have permission to access this page.",
      icon: 'warning',// Replace with your custom HTML icon
      timer: 1600,
      showConfirmButton: false,
      position: 'top'
    });


  }
  onClickUpdate(id:any):any {
    const rolesString = localStorage.getItem('roles');
    if(rolesString!=null){
      const rolesArray = JSON.parse(rolesString);
      for(const role of rolesArray){
      if (role  == 'Attendance.Update'|| role=='Admin'){
        const encryptedId = this.encryptionService.encryptData(id);
        this.router.navigate(['/addAttendence', encryptedId , 'edit'])

        return true;
      }}

      this.sweet()
      return false;

  }
  }

  onClickDelete(id:any):any{
    const rolesString = localStorage.getItem('roles');
    if(rolesString!=null){
      const rolesArray = JSON.parse(rolesString);
      for(const role of rolesArray){
      if (role  == 'Attendance.Delete'||role=='Admin'){
        this.deleteAttendanceHandler(id);
        return true;
      } }

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
