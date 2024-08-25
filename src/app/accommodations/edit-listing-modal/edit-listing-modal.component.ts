import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Listing } from '../listings/listing.model';
import { ListingsService } from '../listings/listings.service';

@Component({
  selector: 'app-edit-listing-modal',
  templateUrl: './edit-listing-modal.page.html',
  styleUrls: ['./edit-listing-modal.page.scss'],
})
export class EditListingModalComponent implements OnInit {
  @Input() listing: Listing = {} as Listing;
  editedListing: Listing = {} as Listing;

  constructor(private listingsService: ListingsService,
    private modalController: ModalController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.editedListing = { ...this.listing };
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async saveChanges() {
    try {
      await this.listingsService.updateListing(this.listing.id, this.editedListing).toPromise();
      await this.modalController.dismiss({
        updatedListing: this.editedListing
      });

      const alert = await this.alertController.create({
        header: 'Uspešno!',
        message: 'Oglas je uspešno ažuriran.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Greška',
        message: 'Greška pri ažuriranju oglasa.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


}
