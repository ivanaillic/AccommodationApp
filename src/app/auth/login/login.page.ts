import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    if (logInForm.valid) {
      this.isLoading = true;
      this.authService.logIn(logInForm.value).subscribe((resData) => {
        console.log('Prijava uspešna');
        console.log(resData);
        this.isLoading = false;
        this.router.navigateByUrl('/accommodations/tabs/homepage');
      }, () => {
        console.log('Greška prilikom prijave');
        this.isLoading = false;
      });
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/auth/register');
  }
}
