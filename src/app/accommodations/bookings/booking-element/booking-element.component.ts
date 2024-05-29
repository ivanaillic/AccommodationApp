import { Component, Input, OnInit } from '@angular/core';
import { Booking } from '../booking.model';
import { ListingsService } from '../../listings/listings.service';


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

  constructor(private listingService: ListingsService) { }

  ngOnInit() {
    this.getListingTitle(this.booking.listing_id);
  }

  getListingTitle(listingId: string): void {
    this.listingService.getListingTitle(listingId).subscribe(title => {
      this.listingTitle = title;
    });
  }
}
