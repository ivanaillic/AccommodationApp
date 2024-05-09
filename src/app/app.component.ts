import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isUserAuthenticated;
  }

  onLogout() {
    this.authService.logOut();
  }
}
