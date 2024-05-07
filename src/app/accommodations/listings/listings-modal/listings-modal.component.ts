import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'app-listings-modal',
  templateUrl: './listings-modal.component.html',
  styleUrls: ['./listings-modal.component.scss'],
})
export class ListingsModalComponent {
  listingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private listingsService: ListingsService
  ) {
    this.listingForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price_per_day: [null, Validators.required],
      location: ['', Validators.required],
      capacity_persons: [null, Validators.required],
      image_url: ['', Validators.required]
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addListing() {
    if (this.listingForm.valid) {
      this.listingsService.addListing(
        this.listingForm.value.title,
        this.listingForm.value.description,
        this.listingForm.value.price_per_day,
        this.listingForm.value.location,
        this.listingForm.value.capacity_persons,
        this.listingForm.value.image_url,
        1

      ).subscribe(
        (res) => {
          console.log('New Listing added:', res);
          this.dismiss();
        },
        (error) => {
          console.error('Error adding new listing:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
