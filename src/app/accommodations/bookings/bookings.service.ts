import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  bookings: Booking[] = [
    {
      id: '1',
      user_id: '101',
      listing_id: '201',
      start_date: new Date('2024-04-10'),
      end_date: new Date('2024-04-15'),
      status: 'confirmed'
    },
    {
      id: '2',
      user_id: '102',
      listing_id: '202',
      start_date: new Date('2024-05-01'),
      end_date: new Date('2024-05-07'),
      status: 'pending'
    },
    {
      id: '3',
      user_id: '103',
      listing_id: '203',
      start_date: new Date('2024-06-10'),
      end_date: new Date('2024-06-20'),
      status: 'cancelled'
    }
  ];

  // constructor() { }
  getBooking(id: number): Booking {
    const foundBooking = this.bookings.find(b => b.id === id.toString());
    if (!foundBooking) {
      throw new Error(`Booking sa ID ${id} nije pronadjen.`);
    }
    return foundBooking;
  }


}
