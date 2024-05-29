import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from './booking.model';
import { SpecialRequest } from './booking/special-request.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private readonly BASE_URL = 'https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(private http: HttpClient) { }

  getBooking(id: string): Observable<Booking> {
    const url = `${this.BASE_URL}/bookings/${id}.json`;
    return this.http.get<Booking>(url).pipe(
      catchError(error => {
        console.error('Greška prilikom dohvatanja detalja rezervacije:', error);
        throw error;
      })
    );
  }

  getSpecialRequestsByBookingId(bookingId: string): Observable<SpecialRequest[]> {
    const url = `${this.BASE_URL}/special_requests.json?orderBy="booking_id"&equalTo="${bookingId}"`;
    return this.http.get<SpecialRequest[]>(url).pipe(
      catchError(error => {
        console.error('Greška prilikom dohvatanja specijalnih zahteva:', error);
        throw error;
      })
    );
  }
}
