import { Component, OnInit } from '@angular/core';
import { Listing } from '../listing.model';
import { ListingsService } from '../listings.service';
import { ModalController } from '@ionic/angular';
import { ListingsModalComponent } from '../listings-modal/listings-modal.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  listings: Listing[] = [];
  filteredListings: Listing[] = [];


  constructor(private listingsService: ListingsService, private modalController: ModalController, public authService: AuthService) { }



  ngOnInit() {
    this.listingsService.getListings().subscribe((listings) => {
      this.listings = listings;
      this.filteredListings = listings;
    });

    console.log("Is user authenticated:", this.authService.isUserAuthenticated);
  }


  ionViewWillEnter() {
    this.listingsService.fetchListings().subscribe(
      (listingsData: any) => {
        // this.listings = listingsData;
      });
  }

  async openListingsModal() {
    const modal = await this.modalController.create({
      component: ListingsModalComponent
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.listingsService.addListing(data.title, data.description, data.price_per_day, data.location, data.capacity_persons, data.image_url, data.user_id)
        .subscribe((res) => {
          console.log(res);
        });
    }
  }

  filterListings(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredListings = this.listings;
      return;
    }

    this.filteredListings = this.listings.filter(listing => {
      return listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.location.toLowerCase().includes(searchTerm);
    });
  }
}
