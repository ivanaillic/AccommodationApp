import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from './booking.service';
import { Booking } from '../booking.model';

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
    private bookingService: BookingService,
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
    this.bookingsSubscription = this.bookingService.getBookingsByUserId(this.userId).subscribe(bookings => {
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

    try {
      if (this.startDate >= this.endDate) {
        this.dateError = 'Pocetni datum mora biti pre krajnjeg datuma';
        return;
      } else {
        this.dateError = '';
      }

      await this.bookingService.addBooking(this.listingId, this.startDate, this.endDate, specialRequests).toPromise();
      const alert = await this.alertController.create({
        header: 'Uspeh',
        message: 'Uspešno ste rezervisali smeštaj!',
        buttons: ['OK']
      });

      await alert.present();
      this.navCtrl.back();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Greška',
        message: 'Došlo je do greške prilikom rezervacije. Molimo pokušajte ponovo.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }


}
