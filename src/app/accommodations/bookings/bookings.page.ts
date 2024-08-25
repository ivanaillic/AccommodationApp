import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Booking } from './booking.model';
import { BookingsService } from './bookings.service';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: Booking[] = [];

  constructor(
    private bookingsService: BookingsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.bookingsService.getBookingsByUserId(userId).subscribe(bookings => {
          this.bookings = bookings;
        });
      }
    });
  }
}
