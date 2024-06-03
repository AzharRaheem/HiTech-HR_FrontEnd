import { Component, OnInit } from '@angular/core';
import { PublicSettingService } from './services/public-setting.service';
import { DepartmentService } from './services/department.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  publicSetting: any;
  departments: any;
  constructor(public publicSettingsSerivices: PublicSettingService, public deparmentsServices: DepartmentService,public login:LoginService) { }
  ngOnInit(): void {
    this.deparmentsServices.getDepartments().subscribe({
      next: data => {
        this.departments = data;
        if (this.departments.length == 0) {
          this.deparmentsServices.addDepartment({
            "name": "Development"
          }).subscribe({
            next: data => console.log(data)

          });
          this.deparmentsServices.addDepartment({
            "name": "Sales"
          }).subscribe({
            next: data => console.log(data)

          });
          this.deparmentsServices.addDepartment({
            "name": "Marketting"
          }).subscribe({
            next: data => console.log(data)

          });
        }
      }
    })

  }

  addpublicSetting(p: any) {
    this.publicSettingsSerivices.addPublicSetting(p).subscribe({
      next: data => console.log(data)

    })
  }
  IsLoggedIn(): boolean {
    return this.login.IsLoggedIn();
  }
}
