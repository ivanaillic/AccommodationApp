import { Component, OnInit } from '@angular/core';
import { ListingsService } from '../listings/listings.service';
import { Listing } from '../listings/listing.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { EditListingModalPage } from '../edit-listing-modal/edit-listing-modal.page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  myListings: Listing[] = [];
  userId$: Observable<string | null>;

  constructor(
    private listingsService: ListingsService,
    private authService: AuthService,
    private modalController: ModalController,
    private location: Location,
  ) {
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

  async openEditModal(listing: Listing) {
    const modal = await this.modalController.create({
      component: EditListingModalPage,
      componentProps: {
        listing: listing
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.updatedListing) {
      const index = this.myListings.findIndex(item => item.id === data.updatedListing.id);
      if (index !== -1) {
        this.myListings[index] = data.updatedListing;
      }
    }
  }

  goBack() {
    this.location.back();
  }


}
