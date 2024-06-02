import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.page.html',
  styleUrls: ['./accommodations.page.scss'],
})
export class AccommodationsPage implements OnInit {

  isAuthenticated$: Observable<boolean>;


  ngOnInit() {
  }

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isUserAuthenticated;
  }
}
