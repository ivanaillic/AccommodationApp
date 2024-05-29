import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Listing } from '../listing.model';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-listing-element',
  templateUrl: './listing-element.component.html',
  styleUrls: ['./listing-element.component.scss'],
})
export class ListingElementComponent implements OnInit, OnDestroy {
  @Input() listing: Listing = {
    id: "q2",
    title: 'Planinska kuća',
    description: 'Rustična planinska kuća u šumskom ambijentu.',
    price_per_day: 80,
    location: 'Zlatibor, Srbija',
    capacity_persons: 6,
    image_url: 'https://www.pexels.com/photo/view-of-tourist-resort-338504/',
    user_id: "u2"
  };

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
    this.router.navigate(['/accommodations/tabs/bookings/booking', this.listing.id]);
  }

}
