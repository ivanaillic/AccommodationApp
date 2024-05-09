import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../listing.model';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-listing-element',
  templateUrl: './listing-element.component.html',
  styleUrls: ['./listing-element.component.scss'],
})
export class ListingElementComponent implements OnInit {
  @Input() listing: Listing = {
    id: "q2",
    title: 'Planinska kuća',
    description: 'Rustična planinska kuća u šumskom ambijentu.',
    price_per_day: 80,
    location: 'Zlatibor, Srbija',
    capacity_persons: 6,
    image_url: 'https://www.pexels.com/photo/view-of-tourist-resort-338504/',
    user_id: "u2"
  };
  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  async rezervisiSmestaj() {
    const alert = await this.alertController.create({
      header: 'Potvrda rezervacije',
      message: 'Da li ste sigurni da želite da rezervišete smeštaj?',
      buttons: [
        {
          text: 'Odustani',
          role: 'cancel'
        },
        {
          text: 'Potvrdi',
          handler: () => {
            console.log('Potvrda rezervacije');
          }
        }
      ]
    });

    await alert.present();
  }
}
