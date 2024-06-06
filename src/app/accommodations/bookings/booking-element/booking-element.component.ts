import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../booking.model';
import { ListingsService } from '../../listings/listings.service';
import { SpecialRequest } from '../booking/special-request.model';
import { BookingsService } from '../bookings.service';
import { BookingService } from '../booking/booking.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-booking-element',
  templateUrl: './booking-element.component.html',
  styleUrls: ['./booking-element.component.scss'],
})
export class BookingElementComponent implements OnInit {
  @Input() booking: Booking = {
    id: '1',
    user_id: '101',
    listing_id: '201',
    start_date: new Date('2024-04-10'),
    end_date: new Date('2024-04-15'),
    status: 'confirmed'
  };
  listingTitle: string = '';
  specialRequests: SpecialRequest[] = [];
  isCancelled: boolean = false;

  constructor(
    private listingService: ListingsService,
    private bookingsService: BookingsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private bookingService: BookingService

  ) { }

  ngOnInit() {
    this.getListingTitle(this.booking.listing_id);
    this.fetchSpecialRequests(this.booking.id);
  }

  getListingTitle(listingId: string): void {
    this.listingService.getListingTitle(listingId).subscribe(title => {
      this.listingTitle = title;
    });
  }


  fetchSpecialRequests(bookingId: string) {
    this.bookingsService.getSpecialRequestsByBookingId(bookingId).subscribe(
      (specialRequests: SpecialRequest[]) => {
        this.specialRequests = specialRequests;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja specijalnih zahteva:', error);
      }
    );
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


}

