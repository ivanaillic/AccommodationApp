import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingBookingsPageRoutingModule } from './listing-bookings-routing.module';

import { ListingBookingsPage } from './listing-bookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingBookingsPageRoutingModule
  ],
  declarations: [ListingBookingsPage]
})
export class ListingBookingsPageModule {}
