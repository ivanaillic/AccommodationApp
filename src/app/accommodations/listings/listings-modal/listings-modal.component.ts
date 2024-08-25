import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { ListingsService } from '../listings.service';
import { AuthService } from 'src/app/auth/auth.service';

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
    private alertController: AlertController,
    private listingsService: ListingsService,
    private authService: AuthService
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

  async addListing() {
    if (this.listingForm.valid) {
      this.authService.getUserId().subscribe(userId => {
        if (userId) {
          this.listingsService.addListing(
            this.listingForm.value.title,
            this.listingForm.value.description,
            this.listingForm.value.price_per_day,
            this.listingForm.value.location,
            this.listingForm.value.capacity_persons,
            this.listingForm.value.image_url,
            userId
          ).subscribe(
            async (res) => {
              console.log('New Listing added:', res);
              const alert = await this.alertController.create({
                header: 'Uspeh',
                message: 'Uspešno kreiran oglas.',
                buttons: ['OK']
              });
              await alert.present();
              this.dismiss();
            },
            async (error) => {
              console.error('Error adding new listing:', error);
              const alert = await this.alertController.create({
                header: 'Greška',
                message: 'Greška prilikom kreiranja oglasa.',
                buttons: ['OK']
              });
              await alert.present();
            }
          );
        } else {
          console.error('Korisnik nije pronadjen');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
