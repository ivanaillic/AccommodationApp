import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap, take, map, catchError } from 'rxjs/operators';
import { Listing } from "./listing.model";
import { AuthService } from 'src/app/auth/auth.service';

interface ListingData {
  title: string;
  description: string;
  price_per_day: number;
  location: string;
  capacity_persons: number;
  image_url: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListingsService {

  private _listings = new BehaviorSubject<Listing[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  getListings() {
    return this._listings.asObservable();
  }

  addListing(title: string, description: string, price_per_day: number, location: string, capacity_persons: number, imageUrl: string, userId: string) {
    let generatedId: string;
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user found!');
        }
        return this.http.post<{ name: string }>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings.json?auth=${user.token}`,
          {
            title,
            description,
            price_per_day,
            location,
            capacity_persons,
            image_url: imageUrl,
            user_id: userId
          }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.getListings();
      }),
      take(1),
      tap((listings) => {
        const updatedListings = [...listings, {
          id: generatedId,
          title,
          description,
          price_per_day,
          location,
          capacity_persons,
          image_url: imageUrl,
          user_id: userId
        }];
        this._listings.next(updatedListings);
      })
    );
  }

  fetchListings() {
    return this.http.get<{ [key: string]: ListingData }>(
      `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings.json`
    ).pipe(
      tap((listingsData) => {
        const listings: Listing[] = [];
        for (const key in listingsData) {
          if (listingsData.hasOwnProperty(key)) {
            listings.push({
              id: key,
              title: listingsData[key].title,
              description: listingsData[key].description,
              price_per_day: listingsData[key].price_per_day,
              location: listingsData[key].location,
              capacity_persons: listingsData[key].capacity_persons,
              image_url: listingsData[key].image_url,
              user_id: listingsData[key].user_id
            });
          }
        }
        this._listings.next(listings);
      }),
      catchError(error => {
        console.error('Error fetching listings:', error);
        return of([]);
      })
    );
  }

  getListing(id: string) {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user found!');
        }
        return this.http.get<ListingData>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings/${id}.json?auth=${user.token}`
        );
      }),
      map((listingData) => {
        return {
          id,
          title: listingData.title,
          description: listingData.description,
          price_per_day: listingData.price_per_day,
          location: listingData.location,
          capacity_persons: listingData.capacity_persons,
          image_url: listingData.image_url,
          user_id: listingData.user_id
        };
      })
    );
  }

  deleteListing(id: string) {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user found!');
        }
        return this.http.delete(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings/${id}.json?auth=${user.token}`
        );
      }),
      switchMap(() => {
        return this.getListings();
      }),
      take(1),
      tap((listings) => {
        this._listings.next(listings.filter(listing => listing.id !== id));
      })
    );
  }

  updateListing(id: string, updatedListingData: Partial<ListingData>) {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user found!');
        }
        return this.http.patch(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings/${id}.json?auth=${user.token}`,
          updatedListingData
        );
      }),
      switchMap(() => {
        return this.getListings();
      }),
      take(1),
      tap((listings) => {
        const updatedListings = listings.map(listing => {
          if (listing.id === id) {
            return { ...listing, ...updatedListingData };
          }
          return listing;
        });
        this._listings.next(updatedListings);
      })
    );
  }

  getListingTitle(listingId: string): Observable<string> {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user found!');
        }
        return this.http.get<ListingData>(
          `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/listings/${listingId}.json?auth=${user.token}`
        );
      }),
      map((listingData) => {
        return listingData.title;
      })
    );
  }
}
