import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Booking } from './booking.model';
import { SpecialRequest } from './booking/special-request.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBooking(id: string): Observable<Booking> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user or token found!');
        }
        return this.http.get<Booking>(`https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings/${id}.json?auth=${user.token}`).pipe(
          catchError(error => {
            console.error('Error fetching booking details:', error);
            throw error;
          })
        );
      })
    );
  }

  getSpecialRequestsByBookingId(bookingId: string): Observable<SpecialRequest[]> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user or token found!');
        }
        return this.http.get<SpecialRequest[]>(`https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/special_requests.json?orderBy="booking_id"&equalTo="${bookingId}"&auth=${user.token}`).pipe(
          catchError(error => {
            console.error('Error fetching special requests:', error);
            throw error;
          })
        );
      })
    );
  }


}
