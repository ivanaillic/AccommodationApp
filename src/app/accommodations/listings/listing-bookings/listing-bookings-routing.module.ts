import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingBookingsPage } from './listing-bookings.page';

const routes: Routes = [
  {
    path: '',
    component: ListingBookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingBookingsPageRoutingModule {}
