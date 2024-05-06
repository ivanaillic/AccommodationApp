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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    if (logInForm.valid) {
      this.authService.logIn();
      this.router.navigateByUrl('/accommodations/tabs/homepage');
    }
  }
  goToRegister() {
    this.router.navigateByUrl('/auth/register');
  }

}
