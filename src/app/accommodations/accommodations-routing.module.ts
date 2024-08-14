import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccommodationsPage } from './accommodations.page';
import { authGuard } from '../auth/auth.guard';


const routes: Routes = [
  {
    path: 'tabs',
    component: AccommodationsPage,
    children: [
      {
        path: 'homepage',
        loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepagePageModule)
      },
      {
        path: 'bookings',
        children: [
          {
            path: '',
            loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsPageModule),
            canActivate: [authGuard],
          },
          {
            path: 'details',
            loadChildren: () => import('./bookings/details/details.module').then(m => m.DetailsPageModule),
            canActivate: [authGuard],
          },
          {
            path: 'booking/:listingId',
            loadChildren: () => import('./bookings/booking/booking.module').then(m => m.BookingPageModule),
            canActivate: [authGuard]
          },
          {
            path: 'booking-details/:bookingId',
            loadChildren: () => import('./bookings/details/booking-details/booking-details.module').then(m => m.BookingDetailsPageModule),
            canActivate: [authGuard]
          }
        ]
      },

      {
        path: 'listings',
        children: [
          {
            path: '',
            loadChildren: () => import('./listings/listings.module').then(m => m.ListingsPageModule)
          },
          {
            path: 'explore',
            loadChildren: () => import('./listings/explore/explore.module').then(m => m.ExplorePageModule)
          },
          {
            path: 'listing-bookings/:listingId',
            loadChildren: () => import('./listings/listing-bookings/listing-bookings.module').then(m => m.ListingBookingsPageModule)
          }
        ]
      },

      {
        path: '',
        redirectTo: '/accommodations/tabs/homepage',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/accommodations/tabs/homepage',
    pathMatch: 'full'
  },
  {
    path: 'my-listings',
    loadChildren: () => import('./my-listings/my-listings.module').then(m => m.MyListingsPageModule),
  },
  {
    path: 'edit-listing-modal',
    loadChildren: () => import('./edit-listing-modal/edit-listing-modal.module').then(m => m.EditListingModalPageModule)
  },
  {
    path: 'users/:userId',
    loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule)
  },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccommodationsPageRoutingModule { }
