import { Component, OnInit } from '@angular/core';
import { Listing } from '../listing.model';
import { ListingsService } from '../listings.service';
import { ModalController } from '@ionic/angular';
import { ListingsModalComponent } from '../listings-modal/listings-modal.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  listings: Listing[] = [];

  constructor(private listingsService: ListingsService, private modalController: ModalController) { }

  ngOnInit() {
    this.listingsService.getListings().subscribe((listings) => {
      this.listings = listings;
    });
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


}
