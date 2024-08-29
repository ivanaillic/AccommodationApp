import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(7)]]
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        async resData => {
          console.log('Registracija uspela', resData);
          await this.presentAlert('Registracija uspešna', 'Uspešno ste kreirali nalog');
          this.router.navigate(['/auth/login']);
        },
        async error => {
          console.error('Greška prilikom registracije:', error);
          await this.presentAlert('Greška', 'Greška prilikom kreiranja naloga');
        }
      );
    } else {
      console.log('Molimo popunite ispravno sva polja.');
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
