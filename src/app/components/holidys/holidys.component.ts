import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HolidaysService } from 'src/app/services/holidays.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-holidys',
  templateUrl: './holidys.component.html',
  styleUrls: ['./holidys.component.css']
})
export class HolidysComponent implements OnInit {

  disabledHolidaybtn: boolean = true;
  holidayName: any;
  holidayDate: any;
  holidayNameField: boolean = false;
  holidayDateField: boolean = false;
  holidayDateWithTheSameDate: any;
  ununiqHolidayDate: boolean = false;
  update: boolean = false;
  holidays: any;
  tempholiday: any;
  tempForDelete: any;
  tableLoading: boolean = false;
  userRole: any;
  constructor(public holidayServices: HolidaysService, public router: Router) { }
  holidaysSort(holidaysList: any) {
    for (let i = 0; i < holidaysList.length - 1; i++) {
      for (let j = i + 1; j < holidaysList.length; j++) {
        if (holidaysList[j].holidayDate < holidaysList[i].holidayDate) {
          // Swap elements
          let temp = holidaysList[j];
          holidaysList[j] = holidaysList[i];
          holidaysList[i] = temp;
        }
      }
    }
    return holidaysList;
  }
  ngOnInit(): void {

    this.tableLoading = true
    this.holidayServices.getHolidays().subscribe({
      next: data => {
        this.holidays = data;
        if (this.holidays.length > 0)
          this.holidays = this.holidaysSort(this.holidays)
        this.tableLoading = false;
      }, error: e => {
        this.tableLoading = false;
        this.holidays = [];
        alert(e.error);

      }
    })
  }
  addHoliday() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.holidayName == undefined || this.holidayName == "") this.holidayNameField = true;
        else this.holidayNameField = false;
        if (this.holidayDate == undefined || this.holidayDate == "") this.holidayDateField = true;
        else this.holidayDateField = false;
        if (!this.holidayDateField && !this.holidayNameField) {
          this.holidayDateWithTheSameDate = this.holidays.find((h: any) => h.holidayDate == this.holidayDate);
          if (this.holidayDateWithTheSameDate == undefined || (this.update && this.holidayDate == this.tempholiday.holidayDate)) {
            this.ununiqHolidayDate = false;
            this.tableLoading = true;
            if (this.update) {
              this.tempholiday.name = this.holidayName;
              this.tempholiday.holidayDate = this.holidayDate;
              this.holidayServices.editHoliday({
                "id": this.tempholiday.id,
                "name": this.tempholiday.name,
                "holidayDate": this.tempholiday.holidayDate
              }).subscribe({
                next: data => {

                  this.update = false
                  this.holidayServices.getHolidays().subscribe({
                    next: data => {
                      this.holidays = data;
                      this.holidays = this.holidaysSort(this.holidays)
                      this.tableLoading = false;
                    }, error: e => {
                      this.tableLoading = false;
                      this.holidays = [];
                      alert(e.error);

                    }
                  })
                  // Reset input fields
                  this.holidayName = '';
                  this.holidayDate = '';
                }, error: e => {
                  this.tableLoading = false;
                  alert(e.error);

                }
              })
            }
            else
              this.holidayServices.addHoliday({
                "name": this.holidayName,
                "holidayDate": this.holidayDate
              }).subscribe({
                next: data => {
                  this.holidays.push(data);
                  this.holidays = this.holidaysSort(this.holidays)
                  // Reset input fields
                  this.holidayName = '';
                  this.holidayDate = '';
                  this.disabledHolidaybtn = true;
                  this.tableLoading = false;
                }, error: e => {
                  this.tableLoading = false;
                  this.holidays = [];
                  alert(e.error);

                }

              })
          }
          else {
            this.ununiqHolidayDate = true;
          }

        }
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  }
  editHoliday(id: any) {
    this.tableLoading = true;
    this.holidayServices.getHolidayById(id).subscribe({
      next: data => {
        this.tempholiday = data;
        this.holidayName = this.tempholiday.name;
        this.holidayDate = this.tempholiday.holidayDate;
        this.update = true;
        this.disabledHolidaybtn = false;
        this.tableLoading = false;
      }, error: e => {
        this.tableLoading = false;
        alert(e.error);
      }
    })
  }
  deleteHoliday(id: any) {
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
        this.tableLoading = true;

        this.holidayServices.deleteHoliday(id).subscribe({
          next: data => {
            this.tempForDelete = data;
            this.holidays = this.holidays.filter((h: any) => h.id != this.tempForDelete.id)
            this.tableLoading = false;
            Swal.fire('Holiday deleted Successfully', '', 'success');
          }, error: e => {
            this.tableLoading = false;
            this.holidays = [];
            Swal.fire('Error!', 'An error occurred while deleting this Holiday', 'error');

          }

        })
      }
    });
  }
  changeDisable() {
    if (this.holidayDate && this.holidayDate != '' && this.holidayName && this.holidayName != '') this.disabledHolidaybtn = false
    else this.disabledHolidaybtn = true
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

  onClickUpdate(id: any): any {
    const rolesString = localStorage.getItem('roles');
    if (rolesString != null) {
      const rolesArray = JSON.parse(rolesString);
      for (const role of rolesArray) {
        if (role === 'Holiday.Update' || role == 'Admin') {
          this.editHoliday(id)
          return true;
        }
      }

      this.sweet()
      return false;

    }
  }

  onClickCreate(): any {
    const rolesString = localStorage.getItem('roles');
    if (rolesString != null) {
      const rolesArray = JSON.parse(rolesString);
      for (const role of rolesArray) {
        if (role == 'Holiday.Create' || role == 'Admin') {
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
        if (role == 'Holiday.Delete' || role == 'Admin') {
          this.deleteHoliday(id);
          return true;
        }
      }

      this.sweet()
      return false;

    }
  }

}
