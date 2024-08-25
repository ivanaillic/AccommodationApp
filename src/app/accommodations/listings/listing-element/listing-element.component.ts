import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Listing } from '../listing.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { AlertController } from '@ionic/angular';
import { BookingsService } from '../../bookings/bookings.service';


@Component({
  selector: 'app-listing-element',
  templateUrl: './listing-element.component.html',
  styleUrls: ['./listing-element.component.scss'],
})
export class ListingElementComponent implements OnInit, OnDestroy {
  @Input() listing!: Listing;

  userId: string = '';
  isOwner: boolean = false;
  private userIdSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingsService: BookingsService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.userIdSubscription = this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.userId = userId;
        console.log(`User ID: ${this.userId}`);

        this.bookingsService.isListingOwner(this.listing.id, this.userId).subscribe(isOwner => {
          this.isOwner = isOwner;
          console.log(`Is owner: ${this.isOwner}`);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  async rezervisiSmestaj() {

    if (this.userId) {
      this.bookingsService.isListingOwner(this.listing.id, this.userId).subscribe(async isOwner => {
        console.log(`Is owner: ${isOwner}`);

        this.router.navigate(['/accommodations/tabs/bookings/booking', this.listing.id]);

      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  pogledajRezervacije() {
    this.router.navigate(['/accommodations/tabs/listings/listing-bookings', this.listing.id]);
  }

}

