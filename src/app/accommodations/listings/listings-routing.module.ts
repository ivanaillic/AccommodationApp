import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingsPage } from './listings.page';

const routes: Routes = [
  {
    path: '',
    component: ListingsPage
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExplorePageModule)
  },
  {
    path: 'listing-bookings/:listingId',
    loadChildren: () => import('./listing-bookings/listing-bookings.module').then(m => m.ListingBookingsPageModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingsPageRoutingModule { }
