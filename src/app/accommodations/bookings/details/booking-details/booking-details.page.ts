import { Component, OnInit } from '@angular/core';
import { Booking } from '../../booking.model';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../bookings.service';
import { SpecialRequest } from '../../booking/special-request.model';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  booking!: Booking;
  specialRequests: SpecialRequest[] = [];

  constructor(private route: ActivatedRoute, private bookingsService: BookingsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const bookingId = paramMap.get('bookingId');
      if (bookingId) {
        this.bookingsService.getBooking(bookingId).subscribe(
          (booking: Booking) => {
            this.booking = booking;
            this.fetchSpecialRequests(bookingId);
          },
          (error) => {
            console.error('Greška prilikom dohvatanja rezervacije:', error);
          }
        );
      }
    });
  }

  fetchSpecialRequests(bookingId: string) {
    this.bookingsService.getSpecialRequestsByBookingId(bookingId).subscribe(
      (specialRequestsData: any) => {
        if (specialRequestsData) {
          this.specialRequests = Object.values(specialRequestsData);
        } else {
          console.error('Nije uspelo dohvatanje specijalnih zahteva.');
          this.specialRequests = [];
        }
      },
      (error) => {
        console.error('Greška prilikom dohvatanja specijalnih zahteva:', error);
      }
    );
  }

}
