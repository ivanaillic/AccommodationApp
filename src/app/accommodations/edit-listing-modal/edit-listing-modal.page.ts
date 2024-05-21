import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Listing } from '../listings/listing.model';
import { ListingsService } from '../listings/listings.service';

@Component({
  selector: 'app-edit-listing-modal',
  templateUrl: './edit-listing-modal.page.html',
  styleUrls: ['./edit-listing-modal.page.scss'],
})
export class EditListingModalPage implements OnInit {
  @Input() listing: Listing = {} as Listing;
  editedListing: Listing = {} as Listing;

  constructor(private listingsService: ListingsService, private modalController: ModalController) { }

  ngOnInit() {
    this.editedListing = { ...this.listing };
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveChanges() {
    this.listingsService.updateListing(this.listing.id, this.editedListing).subscribe(() => {
      this.modalController.dismiss({
        updatedListing: this.editedListing
      });
    });
  }

}
