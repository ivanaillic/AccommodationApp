import { Component, OnInit } from '@angular/core';
import { Booking } from '../booking.model';
import { BookingsService } from '../bookings.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  bookings: Booking[];

  constructor(private bookingsService: BookingsService) {
    this.bookings = this.bookingsService.bookings;
  }

  ngOnInit() {
  }

}
