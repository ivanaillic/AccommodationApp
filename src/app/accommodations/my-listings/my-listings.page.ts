import { Component, OnInit } from '@angular/core';
import { ListingsService } from '../listings/listings.service';
import { Listing } from '../listings/listing.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  myListings: Listing[] = [];
  userId$: Observable<string | null>;

  constructor(private listingsService: ListingsService, private authService: AuthService) {
    this.userId$ = this.authService.getUserId();
  }

  ngOnInit() {
    this.loadMyListings();
  }

  loadMyListings() {
    this.userId$.subscribe(userId => {
      if (userId) {
        this.listingsService.getListings().subscribe((listings: Listing[]) => {
          this.myListings = listings.filter(listing => listing.user_id === userId);
        });
      }
    });
  }

  onDeleteListing(id: string) {
    this.listingsService.deleteListing(id).subscribe(() => {
      this.loadMyListings();
    });
  }

  editListing(id: string) {

  }

}
