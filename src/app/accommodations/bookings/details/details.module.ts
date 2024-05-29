import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DetailsPage } from './details.page';
import { DetailsPageRoutingModule } from './details-routing.module';
import { BookingElementComponent } from '../booking-element/booking-element.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DetailsPageRoutingModule
  ],
  declarations: [
    DetailsPage,
    BookingElementComponent
  ]
})
export class DetailsPageModule { }
