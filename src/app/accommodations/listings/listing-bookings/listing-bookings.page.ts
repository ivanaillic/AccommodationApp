import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../bookings/booking.model';
import { BookingService } from '../../bookings/booking/booking.service';
import { UserService } from '../../users/users.service';

@Component({
  selector: 'app-listing-bookings',
  templateUrl: './listing-bookings.page.html',
  styleUrls: ['./listing-bookings.page.scss'],
})
export class ListingBookingsPage implements OnInit {
  listingId: string = '';
  bookings: Booking[] = [];
  userFullNames: { [bookingId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.listingId = this.route.snapshot.paramMap.get('listingId')!;
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookingsForListingOwner(this.listingId).subscribe(bookings => {
      this.bookings = bookings;
      this.bookings.forEach(booking => {
        this.loadUserFullName(booking.user_id, booking.id);
      });
    });
  }

  onChangeStatus(bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') {
    this.bookingService.updateBookingStatus(bookingId, newStatus).subscribe(() => {
      this.loadBookings();
    });
  }

  loadUserFullName(userId: string, bookingId: string) {
    this.userService.getUserFullName(userId).subscribe(
      (fullName) => {
        this.userFullNames[bookingId] = fullName;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja korisničkih podataka:', error);
        this.userFullNames[bookingId] = 'Nepoznat korisnik';
      }
    );
  }
}
