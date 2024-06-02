import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpecialRequest } from './special-request.model';

@Injectable({
    providedIn: 'root'
})
export class SpecialRequestService {
    constructor(private http: HttpClient) { }

    addSpecialRequest(bookingId: string, description: string): Observable<{ name: string }> {
        const newRequest: SpecialRequest = {
            id: null!,
            booking_id: bookingId,
            description: description
        };
        return this.http.post<{ name: string }>(
            `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/special_requests.json`,
            { ...newRequest, id: null }
        );
    }

    getSpecialRequestsByBookingId(bookingId: string): Observable<SpecialRequest[]> {
        return this.http.get<{ [key: string]: SpecialRequest }>(
            `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/special_requests.json?orderBy="booking_id"&equalTo="${bookingId}"`
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
    }

    deleteSpecialRequest(requestId: string): Observable<void> {
        return this.http.delete<void>(
            `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/special_requests/${requestId}.json`
        );
    }

}
