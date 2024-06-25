import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Listing } from '../listing.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from '../../bookings/booking/booking.service';
import { AlertController } from '@ionic/angular';


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
    private bookingService: BookingService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.userIdSubscription = this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.userId = userId;
        console.log(`User ID: ${this.userId}`);
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
      this.bookingService.isListingOwner(this.listing.id, this.userId).subscribe(async isOwner => {
        console.log(`Is owner: ${isOwner}`);

        if (isOwner) {
          await this.showAlert('Greška', 'Ne možete rezervisati sopstveni oglas.');
        } else {
          this.router.navigate(['/accommodations/tabs/bookings/booking', this.listing.id]);
        }
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}

