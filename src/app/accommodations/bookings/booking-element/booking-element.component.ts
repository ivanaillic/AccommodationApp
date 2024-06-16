import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Booking } from '../booking.model';
import { ListingsService } from '../../listings/listings.service';
import { BookingService } from '../booking/booking.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-element',
  templateUrl: './booking-element.component.html',
  styleUrls: ['./booking-element.component.scss'],
})
export class BookingElementComponent implements OnInit, OnDestroy {
  private bookingsSubscription: Subscription | undefined;
  bookings: Booking[] = [];
  userId: string = '';
  isCancelled: boolean = false;

  @Input() booking!: Booking;
  @Output() bookingCanceled = new EventEmitter<void>();
  listingTitle: string = '';

  constructor(
    private listingService: ListingsService,
    private bookingService: BookingService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getListingTitle(this.booking.listing_id);
    this.fetchBookings();
  }

  ngOnDestroy() {
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
  }

  getListingTitle(listingId: string): void {
    this.listingService.getListingTitle(listingId).subscribe(title => {
      this.listingTitle = title;
    });
  }

  async cancelBooking(bookingId: string) {
    const alert = await this.alertController.create({
      header: 'Potvrda otkazivanja',
      message: 'Da li ste sigurni da želite da otkažete ovu rezervaciju?',
      buttons: [
        {
          text: 'Ne',
          role: 'cancel'
        },
        {
          text: 'Da',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Otkazivanje...'
            });
            await loading.present();

            this.bookingService.cancelBooking(bookingId).subscribe(
              async () => {
                await loading.dismiss();

                const successAlert = await this.alertController.create({
                  header: 'Uspeh',
                  message: 'Rezervacija je uspešno otkazana.',
                  buttons: ['OK']
                });
                await successAlert.present();

                this.isCancelled = true;
                this.navCtrl.navigateRoot(['/accommodations/tabs/bookings/details']);
              },
              async (error) => {
                await loading.dismiss();
                console.error('Greška prilikom otkazivanja rezervacije:', error);

                const errorAlert = await this.alertController.create({
                  header: 'Greška',
                  message: 'Došlo je do greške prilikom otkazivanja rezervacije. Molimo pokušajte ponovo.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  fetchBookings() {
    this.bookingsSubscription = this.bookingService.getBookingsByUserId(this.userId).subscribe(bookings => {
      this.bookings = bookings;
    });
  }
}
