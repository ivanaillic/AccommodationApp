import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { SpecialRequest } from './special-request.model';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SpecialRequestService {
    private baseUrl: string = 'https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/special_requests';

    constructor(private http: HttpClient, private authService: AuthService) { }

    addSpecialRequest(bookingId: string, description: string): Observable<{ name: string }> {
        const newRequest: SpecialRequest = {
            id: null!,
            booking_id: bookingId,
            description: description
        };

        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    throw new Error('No user found or user is not authenticated!');
                }
                return this.http.post<{ name: string }>(
                    `${this.baseUrl}.json?auth=${user.token}`,
                    { ...newRequest, id: null }
                );
            })
        );
    }

    getSpecialRequestsByBookingId(bookingId: string): Observable<SpecialRequest[]> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    throw new Error('No user found or user is not authenticated!');
                }
                return this.http.get<{ [key: string]: SpecialRequest }>(
                    `${this.baseUrl}.json?orderBy="booking_id"&equalTo="${bookingId}"&auth=${user.token}`
                ).pipe(
                    map((specialRequestData: { [key: string]: SpecialRequest }) => {
                        const specialRequests: SpecialRequest[] = [];
                        for (const key in specialRequestData) {
                            if (specialRequestData.hasOwnProperty(key)) {
                                specialRequests.push({ ...specialRequestData[key], id: key });
                            }
                        }
                        return specialRequests;
                    })
                );
            })
        );
    }

    deleteSpecialRequest(requestId: string): Observable<void> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    throw new Error('No user found or user is not authenticated!');
                }
                return this.http.delete<void>(
                    `${this.baseUrl}/${requestId}.json?auth=${user.token}`
                );
            })
        );
    }
}
