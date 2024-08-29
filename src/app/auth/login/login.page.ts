import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    if (logInForm.valid) {
      this.isLoading = true;
      this.authService.logIn(logInForm.value).subscribe(async (resData) => {
        this.isLoading = false;
        await this.presentAlert('Uspeh', 'Uspešna prijava', 'OK');
        this.router.navigateByUrl('/accommodations/tabs/homepage');
      }, async (error) => {
        this.isLoading = false;
        let errorMessage = 'Niste uneli ispravne kredencijale';

        if (error.status === 400) {
          errorMessage = 'Niste uneli ispravne kredencijale';
        }

        await this.presentAlert('Greška', errorMessage, 'OK');
      });
    } else {

      this.presentAlert('Greška', 'Niste uneli ispravne kredencijale', 'OK');
    }
  }


  goToRegister() {
    this.router.navigateByUrl('/auth/register');
  }

  async presentAlert(header: string, message: string, buttonText: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [buttonText]
    });

    await alert.present();
  }
  goBack() {
    this.navCtrl.back();
  }

}
