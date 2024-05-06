import { NgModule } from '@angular/core';
import { Routes, RouterModule, mapToCanActivate } from '@angular/router';

import { AccommodationsPage } from './accommodations.page';
import { AdminGuard } from '../auth/auth.guard';


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
            canActivate: [AdminGuard],
          },
          {
            path: 'details',
            loadChildren: () => import('./bookings/details/details.module').then(m => m.DetailsPageModule),
            canActivate: [AdminGuard],
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccommodationsPageRoutingModule { }
