import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { tap, switchMap, take, map, concatMap, mergeMap, catchError } from 'rxjs/operators';
import { Booking } from '../booking.model';
import { AuthService } from 'src/app/auth/auth.service';
import { SpecialRequestService } from './special-request.service';

interface BookingData {
  user_id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private specialRequestService: SpecialRequestService
  ) { }

  get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  addBooking(listingId: string, startDate: string, endDate: string, specialRequests: string[]): Observable<any> {
    let generatedId: string;
    let newBooking: Booking;

    return this.authService.getUserId().pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('Nema korisničkog ID-a');
        }
        newBooking = {
          id: null!,
          user_id: userId,
          listing_id: listingId,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          status: 'confirmed'
        };
        return this.http.post<{ name: string }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json`,
          { ...newBooking, id: null }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        newBooking.id = generatedId;
        const addSpecialRequests$ = from(specialRequests).pipe(
          mergeMap(request => this.specialRequestService.addSpecialRequest(generatedId, request))
        );
        return addSpecialRequests$.pipe(
          take(specialRequests.length),
          map(() => newBooking)
        );
      }),
      switchMap(newBooking => this.bookings.pipe(
        take(1),
        map(bookings => bookings.concat(newBooking))
      )),
      tap(updatedBookings => {
        this._bookings.next(updatedBookings);
      })
    );
  }

  fetchBookings(): Observable<Booking[]> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (!userId) {
          return throwError('Nema korisničkog ID-a');
        }
        return this.http.get<{ [key: string]: BookingData }>('https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json').pipe(
          map(bookingData => {
            const bookings: Booking[] = [];
            for (const key in bookingData) {
              if (bookingData.hasOwnProperty(key) && bookingData[key].user_id === userId) {
                bookings.push({
                  id: key,
                  user_id: bookingData[key].user_id,
                  listing_id: bookingData[key].listing_id,
                  start_date: new Date(bookingData[key].start_date),
                  end_date: new Date(bookingData[key].end_date),
                  status: bookingData[key].status
                });
              }
            }
            return bookings;
          }),
          catchError(error => {
            console.error('Greška prilikom dohvatanja rezervacija:', error);
            return throwError(error);
          })
        );
      })
    );
  }

  getBookingsByUserId(userId: string): Observable<Booking[]> {
    return this.http.get<{ [key: string]: BookingData }>(
      `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json`
    ).pipe(
      map(bookingData => {
        const bookings: Booking[] = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key) && bookingData[key].user_id === userId) {
            bookings.push({
              id: key,
              user_id: bookingData[key].user_id,
              listing_id: bookingData[key].listing_id,
              start_date: new Date(bookingData[key].start_date),
              end_date: new Date(bookingData[key].end_date),
              status: bookingData[key].status
            });
          }
        }
        return bookings;
      })
    );
  }
}
