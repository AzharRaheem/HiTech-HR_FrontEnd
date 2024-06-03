import { Component, OnInit } from '@angular/core';
import { PublicSettingService } from 'src/app/services/public-setting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  welcomeText = "Welcome To Hi-Tech Solution HR System";
  welcomeAnimationText = "";
  animationInterval: any;

  constructor(public settingServices: PublicSettingService) { }

  ngOnInit(): void {
    this.animateText();
  }

  animateText() {
    let index = 0;
    this.animationInterval = setInterval(() => {
      if (index < this.welcomeText.length) {
        const letter = this.welcomeText[index];
        this.welcomeAnimationText += letter;
        index++;
      } else {
        clearInterval(this.animationInterval);
      }
    }, 70);
  }

  addPublicSetting(data: any) {
    this.settingServices.addPublicSetting(data).subscribe({
      next: data => console.log(data)
    });
  }
}