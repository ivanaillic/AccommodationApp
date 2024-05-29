import { Component, OnInit } from '@angular/core';
import { Booking } from '../booking.model';
import { BookingService } from '../booking/booking.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingService.fetchBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }
}
