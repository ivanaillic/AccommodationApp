import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { tap, switchMap, take, map, mergeMap, catchError, toArray } from 'rxjs/operators';
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

    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user found or user is not authenticated!');
        }
        newBooking = {
          id: null!,
          user_id: user.id,
          listing_id: listingId,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          status: 'confirmed'
        };
        return this.http.post<{ name: string }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?auth=${user.token!}`,
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
          toArray(),
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
    return this.authService.user.pipe(
      switchMap(user => {
        if (!user || !user.token) {
          return throwError('No user found or user is not authenticated!');
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?auth=${user.token!}`
        ).pipe(
          map(bookingData => {
            return Object.keys(bookingData).map(key => {
              const data = bookingData[key];
              if (data.user_id === user.id) {
                return {
                  id: key,
                  user_id: data.user_id,
                  listing_id: data.listing_id,
                  start_date: new Date(data.start_date),
                  end_date: new Date(data.end_date),
                  status: data.status
                };
              }
              return null;
            }).filter(booking => booking !== null) as Booking[];
          }),
          catchError(error => {
            console.error('Error fetching bookings:', error);
            return throwError(error);
          })
        );
      })
    );
  }


  getBookingsByUserId(userId: string): Observable<Booking[]> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user found or user is not authenticated!');
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?auth=${user.token!}`
        ).pipe(
          map(bookingData => {
            return Object.keys(bookingData).map(key => {
              const data = bookingData[key];
              if (data.user_id === userId) {
                return {
                  id: key,
                  user_id: data.user_id,
                  listing_id: data.listing_id,
                  start_date: new Date(data.start_date),
                  end_date: new Date(data.end_date),
                  status: data.status
                };
              }
              return null;
            }).filter(booking => booking !== null) as Booking[];
          })
        );
      })
    );
  }


  cancelBooking(bookingId: string): Observable<void> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user found or user is not authenticated!');
        }
        console.log(`User token: ${user.token}`);
        return this.specialRequestService.getSpecialRequestsByBookingId(bookingId).pipe(
          switchMap(specialRequests => {
            if (specialRequests.length === 0) {
              return this.deleteBooking(bookingId, user.token!);
            }
            return from(specialRequests).pipe(
              mergeMap(request => this.specialRequestService.deleteSpecialRequest(request.id)),
              toArray(),
              switchMap(() => this.deleteBooking(bookingId, user.token!))
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error while cancelling booking:', error);
        return throwError(error);
      })
    );
  }

  private deleteBooking(bookingId: string, token: string): Observable<void> {
    return this.http.delete<void>(
      `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json?auth=${token}`
    ).pipe(
      switchMap(() => this.bookings.pipe(
        take(1),
        map(bookings => bookings.filter(booking => booking.id !== bookingId)),
        tap(updatedBookings => this._bookings.next(updatedBookings)),
        map(() => undefined)
      ))
    );
  }

  areDatesAvailable(listingId: string, startDate: string, endDate: string): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user found or user is not authenticated!');
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="listing_id"&equalTo="${listingId}"&auth=${user.token!}`
        ).pipe(
          map(bookingData => {
            for (const key in bookingData) {
              if (bookingData.hasOwnProperty(key)) {
                const bookedStartDate = new Date(bookingData[key].start_date);
                const bookedEndDate = new Date(bookingData[key].end_date);
                const newStartDate = new Date(startDate);
                const newEndDate = new Date(endDate);
                if (
                  (newStartDate >= bookedStartDate && newStartDate < bookedEndDate) ||
                  (newEndDate > bookedStartDate && newEndDate <= bookedEndDate) ||
                  (newStartDate <= bookedStartDate && newEndDate >= bookedEndDate)
                ) {
                  return false;
                }
              }
            }
            return true;
          })
        );
      })
    );
  }

  isListingOwner(listingId: string, userId: string): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user || !user.token) {
          throw new Error('No user found or user is not authenticated!');
        }
        return this.http.get<{ user_id: string }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings/${listingId}.json?auth=${user.token!}`
        ).pipe(
          map(listingData => {
            if (!listingData) {
              console.error(`No data found for listing ID: ${listingId}`);
              return false;
            }

            const listingOwnerId = listingData.user_id;
            if (!listingOwnerId) {
              console.error(`User ID not found for listing ID: ${listingId}`);
              return false;
            }

            const isOwner = listingOwnerId === userId;
            console.log(`Listing ID: ${listingId}, Listing Owner ID: ${listingOwnerId}, User ID: ${userId}, Is Owner: ${isOwner}`);
            return isOwner;
          })
        );
      })
    );
  }
}
