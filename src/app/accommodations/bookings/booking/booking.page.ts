import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Booking } from '../booking.model';
import { BookingsService } from '../bookings.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, OnDestroy {
  startDate: string = '';
  endDate: string = '';
  listingId!: string;
  userId: string = '';
  specialRequests: string[] = [];
  private userIdSubscription!: Subscription;
  private bookingsSubscription!: Subscription;
  dateError: string = '';
  bookings: Booking[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private bookingsService: BookingsService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.listingId = params.get('listingId') || '';
      console.log('Listing ID:', this.listingId);
    });

    this.userIdSubscription = this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.userId = userId;
        this.fetchBookings();
      }
    });
  }

  ngOnDestroy() {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
  }

  fetchBookings() {
    this.bookingsSubscription = this.bookingsService.getBookingsByUserId(this.userId).subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  addSpecialRequest() {
    this.specialRequests.push('');
  }

  onSpecialRequestChange(event: any, index: number) {
    this.specialRequests[index] = event.detail.value;
  }

  async confirmBooking() {
    const specialRequests = this.specialRequests.map(request => request.trim()).filter(request => request.length > 0);
    const currentDate = new Date().toISOString().split('T')[0];

    if (this.startDate < currentDate || this.endDate < currentDate) {
      await this.showAlert('Greška', 'Datumi ne mogu biti u prošlosti');
      return;
    } else if (this.startDate >= this.endDate) {
      await this.showAlert('Greška', 'Početni datum mora biti pre krajnjeg datuma');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Provera dostupnosti datuma...'
    });
    await loading.present();

    try {

      const areDatesAvailable = await this.bookingsService.areDatesAvailable(this.listingId, this.startDate, this.endDate).toPromise();
      await loading.dismiss();

      if (!areDatesAvailable) {
        await this.showAlert('Greška', 'Datumi su već zauzeti. Molimo odaberite druge datume.');
        return;
      }

      await this.bookingsService.addBooking(this.listingId, this.startDate, this.endDate, specialRequests).toPromise();
      await this.showAlert('Uspeh', 'Uspešno ste rezervisali smeštaj!');
      this.navCtrl.back();
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Greška', 'Došlo je do greške prilikom rezervacije. Molimo pokušajte ponovo.');
    }
  }



  async deleteBooking(bookingId: string) {
    const alert = await this.alertController.create({
      header: 'Potvrda',
      message: 'Da li ste sigurni da želite da otkažete rezervaciju?',
      buttons: [
        {
          text: 'Ne',
          role: 'cancel',
        },
        {
          text: 'Da',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Otkazivanje rezervacije...'
            });
            await loading.present();

            this.bookingsService.cancelBooking(bookingId).subscribe({
              next: async () => {
                await loading.dismiss();
                await this.showAlert('Uspeh', 'Rezervacija je uspešno otkazana!');
                this.fetchBookings();
                this.navCtrl.navigateRoot(['/accommodations/tabs/bookings']);
              },
              error: async () => {
                await loading.dismiss();
                await this.showAlert('Greška', 'Došlo je do greške prilikom otkazivanja rezervacije. Molimo pokušajte ponovo.');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
