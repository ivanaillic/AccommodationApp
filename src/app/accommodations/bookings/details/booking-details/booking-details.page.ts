import { Component, OnInit } from '@angular/core';
import { Booking } from '../../booking.model';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../bookings.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  booking: Booking = {
    id: '1',
    user_id: '101',
    listing_id: '201',
    start_date: new Date('2024-04-10'),
    end_date: new Date('2024-04-15'),
    status: 'confirmed'
  };


  constructor(private route: ActivatedRoute, private bookingsService: BookingsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const bookingId = Number(paramMap.get('bookingId'));
      this.booking = this.bookingsService.getBooking(bookingId);
    });
  }

}
