import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-attendence',
  templateUrl: './add-attendence.component.html',
  styleUrls: ['./add-attendence.component.css']
})

export class AddAttendenceComponent implements OnInit {
  addAttendanceForm: FormGroup;
  departments: any;
  attendanceId: any;
  attendId: any;
  tempData: any;
  employees: any;
  leavingError: boolean = false;
  arrivingError: boolean = false;
  officialHoliday: boolean = false;
  weekendHoliday: boolean = false;
  attendanceExist: boolean = false;

  isEditMode: boolean = false;
  isArrivingEmpty: boolean = false;
  isLeavingEmpty: boolean = false;
  unValidDate: boolean = false;
  dateError: any;
  employeesList: any;
  isDateBeforeContract: boolean = false;
  decryptId: any
  loading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public x: DepartmentService,
    public activatedRoute: ActivatedRoute,
    public attendanceService: AttendanceService,
    public router: Router,
    public employeesService: EmployeesService,
    public encryptionService: EncryptionService
  ) {
    this.addAttendanceForm = this.formBuilder.group({
      employeeName: new FormControl('', [Validators.required]),
      arrivingTime: [''],
      dayDate: new FormControl('', [Validators.required]),
      leavingTime: [''],
    });
  }
  ngOnInit(): void {
    this.isEditMode = this.attendanceId !== '0';
    this.loading = true;
    this.loadDepartments();
    this.loadEmployees(); // Load the list of employees
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.attendanceId = params['id'];
        if (this.attendanceId != 0) {
          this.decryptId = this.encryptionService.decryptData(this.attendanceId);
          this.attendanceId = this.decryptId;
          this.attendanceService.getAttendanceById(this.attendanceId).subscribe({
            next: data => {
              this.tempData = data;
              this.isEditMode = true;
              this.employeesService.getAllEmployees().subscribe({
                next: (data) => {
                  this.employeesList = data;
                  this.employeesList.forEach((emp: any) => {
                    if (emp.nationalID == this.tempData.idemp) {
                      this.getName.setValue(emp.name);
                    }
                  });
                  this.getDate.setValue(this.tempData.dayDate);
                  this.getArrivingTime.setValue(this.tempData.arrivingTime);
                  this.getLeavingTime.setValue(this.tempData.leavingTime);
                  console.log(this.addAttendanceForm);
                  this.loading = false;
                },
                error: (error) => {
                  console.log(error);
                  this.loading = false;
                },
              });
            }
          }

          )
        }
        else {
          this.getName.setValue('');
          this.getDate.setValue('');
          this.getArrivingTime.setValue('');
          this.getLeavingTime.setValue('');
          this.loading = false;
        }
      }

    });

  }

  get getName() {
    return this.addAttendanceForm.controls['employeeName'];
  }
  get getDate() {
    return this.addAttendanceForm.controls['dayDate'];
  }
  get getArrivingTime() {
    return this.addAttendanceForm.controls['arrivingTime'];
  }
  get getLeavingTime() {
    return this.addAttendanceForm.controls['leavingTime'];
  }


  loadDepartments() {
    this.departments = this.x.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadEmployees() {
    this.employeesService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  attendanceHandler(e: any) {
    e.preventDefault();

    var formData = this.addAttendanceForm.value;
    if (formData.arrivingTime && formData.leavingTime) {
      formData.arrivingTime = this.convertToTimeOnly(formData.arrivingTime);
      this.getArrivingTime.setValue(formData.arrivingTime);
      formData.leavingTime = this.convertToTimeOnly(formData.leavingTime);
      this.getLeavingTime.setValue(formData.leavingTime);
    }
    this.isArrivingEmpty = (formData.arrivingTime == null || formData.arrivingTime == "");
    this.isLeavingEmpty = (formData.leavingTime == null || formData.leavingTime == "");
    if ((formData.arrivingTime && formData.leavingTime) || (formData.arrivingTime == null && formData.leavingTime == null) || (formData.arrivingTime == "" && formData.leavingTime == "")) {
      this.leavingError = false;
      this.arrivingError = false;
      if (formData.arrivingTime == "" && formData.leavingTime == "") {
        formData.arrivingTime = null;
        formData.leavingTime = null;
      }
      this.employeesService.getAllEmployees().subscribe({
        next: data => {
          var emps: any = data;
          emps.forEach((emp: any) => {
            if (formData.employeeName == emp.name) {
              if (formData.dayDate < emp.contractDate) this.isDateBeforeContract = true
              else {
                this.isDateBeforeContract = false;
                if (this.attendanceId == '0') {
                  // Add new employee
                  this.attendanceService.addAttendance(formData).subscribe({
                    next: (data) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Attendance added successfully!'
                      });
                      this.router.navigate(['/attendenceReport']);
                      this.officialHoliday = false;
                      this.weekendHoliday = false;
                    },
                    error: (error) => {
                      if (error.error == "This day is official holiday") {
                        this.officialHoliday = true;
                        this.attendanceExist = false;
                        this.unValidDate = false;
                        if (error.error == "this is weekend holiday") {
                          this.weekendHoliday = true;
                        } else {
                          this.weekendHoliday = false;
                        }
                      }
                      else if (error.error == "this is weekend holiday") {
                        this.unValidDate = false;
                        this.weekendHoliday = true;
                        this.officialHoliday = false;
                        this.attendanceExist = false;
                      }
                      else if (error.error == "This attendence already exist") {
                        this.unValidDate = false;
                        this.attendanceExist = true;
                      }
                      else {
                        this.unValidDate = true;
                        this.dateError = error.error;
                        this.officialHoliday = false;
                        this.weekendHoliday = false;
                        this.attendanceExist = false;
                      }; console.log(error.error)
                    }
                  });
                }
                else {
                  // Edit existing employee
                  if (this.getArrivingTime.value == "") this.getArrivingTime.setValue(null);
                  if (this.getLeavingTime.value == "") this.getLeavingTime.setValue(null);
                  formData.employeeName = this.getName.value
                  formData.id = this.attendanceId;
                  var dataupdated = {
                    employeeName: this.getName.value,
                    dayDate: this.getDate.value,
                    arrivingTime: this.getArrivingTime.value,
                    leavingTime: this.getLeavingTime.value
                  }
                  console.log("dataupdated", this.attendanceId, dataupdated);
                  console.log({
                    employeeName: this.getName.value,
                    arrivingTime: this.getArrivingTime.value,
                    leavingTime: this.getLeavingTime.value,
                    dayDate: this.getDate.value
                  });

                  this.attendanceService.editAttendance(this.attendanceId, dataupdated).subscribe({
                    next: data => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Attendance edited successfully!'
                      });
                      this.router.navigate(['/attendenceReport']);
                    },
                    error: (error) => {
                      if (error.error == "This day is official holiday") {
                        this.unValidDate = false;
                        this.officialHoliday = true;
                        this.attendanceExist = false;
                        if (error.error == "this is weekend holiday") {
                          this.weekendHoliday = true;
                        } else {
                          this.weekendHoliday = false;
                        }
                      }
                      else if (error.error == "this is weekend holiday") {
                        this.weekendHoliday = true;
                        this.officialHoliday = false;
                        this.attendanceExist = false;
                        this.unValidDate = false;
                      }
                      else if (error.error == "This Attendence Already Exist") {
                        this.attendanceExist = true;
                        console.log("exist error")
                        this.unValidDate = false;
                      }
                      else if (error.error == "Not allowed to update attendence in this month"){
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "You are not allowed to update attendence in this month",
                        });
                        this.router.navigate(['/attendenceReport']);
                      }
                      else {
                        this.unValidDate = true;
                        this.dateError = error.error;
                        this.officialHoliday = false;
                        this.weekendHoliday = false;
                        this.attendanceExist = false;

                      }; console.log(error.error)
                    }
                  }
                  );

                }
              }
            }
          });
        }
      })
    } else if (this.isArrivingEmpty == false) {
      this.leavingError = true;
      this.arrivingError = false;
    } else if (this.isLeavingEmpty == false) {
      this.leavingError = false;
      this.arrivingError = true;
    }
  }
  convertToTimeOnly(inputValue: string): string {
    console.log("inputValue", inputValue);

    const parts = inputValue.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const timeOnly = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    console.log("timeOnly", timeOnly);

    return timeOnly;
  }

}


