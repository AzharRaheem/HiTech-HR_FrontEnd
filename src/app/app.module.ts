import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PublicSettingComponent } from './components/public-setting/public-setting.component';
import { HolidysComponent } from './components/holidys/holidys.component';
import { SalaryReportComponent } from './components/salary-report/salary-report.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PublicSettingPopUpComponent } from './components/public-setting/public-setting-pop-up/public-setting-pop-up.component';
import { AddPermissionComponent } from './components/roles/add-permission/add-permission.component';
import { LoginComponent } from './components/login/login.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { UserComponent } from './components/user/user.component';
import { RolesComponent } from './components/roles/roles.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { AttendenceComponent } from './components/attendence/attendence.component';
import { AddAttendenceComponent } from './components/add-attendence/add-attendence.component';
import { PdfContentComponent } from './components/salary-report/pdf-content/pdf-content.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './components/services/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PublicSettingComponent,
    HolidysComponent,
    SalaryReportComponent,
    EmployeesComponent,
    PublicSettingPopUpComponent,
    UserComponent,
    AddPermissionComponent,
    LoginComponent,
    AttendenceComponent,
    AddEmployeeComponent,
    RolesComponent,
    EmployeeDetailsComponent,
    AttendenceComponent,
    AddAttendenceComponent,
    EmployeeDetailsComponent,
    PdfContentComponent,
    EmployeeDetailsComponent,
    AllUsersComponent,
    HomeComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [HttpClient], 
  bootstrap: [AppComponent]
})
export class AppModule { }
