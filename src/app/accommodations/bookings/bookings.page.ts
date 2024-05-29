import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Booking } from './booking.model';
import { BookingService } from './booking/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.bookingService.getBookingsByUserId(userId).subscribe(bookings => {
          console.log('Dobijene rezervacije:', bookings);
          this.bookings = bookings;
        });
      }
    });
  }
}
