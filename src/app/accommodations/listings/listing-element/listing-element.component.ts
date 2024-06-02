import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Listing } from '../listing.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-listing-element',
  templateUrl: './listing-element.component.html',
  styleUrls: ['./listing-element.component.scss'],
})
export class ListingElementComponent implements OnInit, OnDestroy {
  @Input() listing!: Listing;

  userId: string = '';
  private userIdSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userIdSubscription = this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.userId = userId;
      }
    });
  }

  ngOnDestroy() {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  rezervisiSmestaj() {
    if (this.userId) {
      this.router.navigate(['/accommodations/tabs/bookings/booking', this.listing.id]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

}
