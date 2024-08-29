import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../bookings/booking.model';

import { UserService } from '../../users/users.service';
import { AlertController, NavController } from '@ionic/angular';
import { BookingsService } from '../../bookings/bookings.service';

@Component({
  selector: 'app-listing-bookings',
  templateUrl: './listing-bookings.page.html',
  styleUrls: ['./listing-bookings.page.scss'],
})
export class ListingBookingsPage implements OnInit {
  listingId: string = '';
  bookings: Booking[] = [];
  userFullNames: { [bookingId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private userService: UserService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.listingId = this.route.snapshot.paramMap.get('listingId')!;
    this.loadBookings();
  }

  loadBookings() {
    this.bookingsService.getBookingsForListingOwner(this.listingId).subscribe(bookings => {
      this.bookings = bookings;
      this.bookings.forEach(booking => {
        this.loadUserFullName(booking.user_id, booking.id);
      });
    });
  }

  async onChangeStatus(bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') {
    try {
      await this.bookingsService.updateBookingStatus(bookingId, newStatus).toPromise();
      await this.presentAlert('Uspeh', 'Uspesno ste promenili status rezervacije');
      this.loadBookings();
    } catch (error) {
      console.error('Greška prilikom postavljanja statusa rezervacije:', error);
      await this.presentAlert('Greska', 'Greška prilikom postavljanja statusa rezervacije');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  loadUserFullName(userId: string, bookingId: string) {
    this.userService.getUserFullName(userId).subscribe(
      (fullName) => {
        this.userFullNames[bookingId] = fullName;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja korisničkih podataka:', error);
        this.userFullNames[bookingId] = 'Nepoznat korisnik';
      }
    );
  }
  goBack() {
    this.navCtrl.back();
  }
}
