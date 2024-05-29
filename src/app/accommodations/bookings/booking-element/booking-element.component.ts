import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../booking.model';
import { ListingsService } from '../../listings/listings.service';
import { SpecialRequest } from '../booking/special-request.model';
import { BookingsService } from '../bookings.service';


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

  constructor(
    private listingService: ListingsService,
    private bookingsService: BookingsService

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
}

