import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PublicSettingService } from 'src/app/services/public-setting.service';
import Swal from 'sweetalert2';
declare var window: any;
@Component({
  selector: 'app-public-setting-pop-up',
  templateUrl: './public-setting-pop-up.component.html',
  styleUrls: ['./public-setting-pop-up.component.css']
})
export class PublicSettingPopUpComponent implements OnInit {
  formModal: any;
  extraHours: any;
  deductionHours: any;
  weekendDay1: any;
  weekendDay2: any;
  extraHoursField: boolean = false;
  deductionHoursField: boolean = false;
  weekendDay1Field: boolean = false
  weekendDay2Field: boolean = false;
  extraHoursInValid: boolean = false;
  deductionHoursInValid: boolean = false;

  @Output() publicSetting = new EventEmitter();
  setting: any;
  constructor(public publicSettingsSerivices: PublicSettingService) { }
  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal'),
      {
        backdrop: 'static', // Prevents closing when clicking outside the modal
        keyboard: false // Disables closing modal with the ESC key
      }
    );
    this.publicSettingsSerivices.getPuplicSetting().subscribe({
      next: data => {
        this.setting = data;
        if (this.setting.length == 0) this.openFormModal();

      },
      error: err => { console.log(err.error) }

    })

  }

  openFormModal() {
    this.formModal.show();
  }
  save(e: any) {
    if (this.extraHours == undefined) this.extraHoursField = true;
    else this.extraHoursField = false;

    if (this.deductionHours == undefined) this.deductionHoursField = true;
    else this.deductionHoursField = false;

    if (this.weekendDay1 == undefined) this.weekendDay1Field = true;
    else this.weekendDay1Field = false;
    if (this.weekendDay2 == undefined) this.weekendDay2Field = true;
    else this.weekendDay2Field = false;

    if (this.extraHours < 1 || this.extraHours > 4) this.extraHoursInValid = true;
    else this.extraHoursInValid = false;
    if (this.deductionHours < 1 || this.deductionHours > 4) this.deductionHoursInValid = true;
    else this.deductionHoursInValid = false;

    if (!this.extraHoursField && !this.deductionHoursField && !this.weekendDay1Field && !this.extraHoursInValid && !this.deductionHoursInValid) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.publicSetting.emit({
            "extraHours": this.extraHours,
            "deductionHours": this.deductionHours,
            "firstWeekend": this.weekendDay1,
            "secondWeekend": this.weekendDay2 == undefined ? null : this.weekendDay2

          })
          this.formModal.hide();
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });

    }
  }

}
