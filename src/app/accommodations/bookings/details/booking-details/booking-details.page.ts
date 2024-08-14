import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BookingsService } from '../../bookings.service';
import { Booking } from '../../booking.model';
import { SpecialRequest } from '../../booking/special-request.model';
import { ListingsService } from 'src/app/accommodations/listings/listings.service';
import { UserService } from 'src/app/accommodations/users/users.service';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
  booking!: Booking;
  specialRequests: SpecialRequest[] = [];
  listingTitle: string = '';
  userFullName: string = '';


  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private listingsService: ListingsService,
    private navCtrl: NavController,
    private userService: UserService

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const bookingId = paramMap.get('bookingId');
      if (bookingId) {
        this.bookingsService.getBooking(bookingId).subscribe(
          (booking: Booking) => {
            this.booking = booking;
            this.fetchSpecialRequests(bookingId);
            this.fetchListingTitle(booking.listing_id);
            this.loadUserFullName(booking.user_id);

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

  fetchListingTitle(listingId: string) {
    this.listingsService.getListingTitle(listingId).subscribe(
      (title: string) => {
        this.listingTitle = title;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja naziva oglasa:', error);
      }
    );
  }

  loadUserFullName(userId: string) {
    this.userService.getUserFullName(userId).subscribe(
      (fullName) => {
        this.userFullName = fullName;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja korisničkih podataka:', error);
        this.userFullName = 'Nepoznat korisnik';
      }
    );
  }

  goBack() {
    this.navCtrl.back();
  }
}
