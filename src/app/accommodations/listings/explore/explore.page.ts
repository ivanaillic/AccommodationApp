import { Component, OnInit } from '@angular/core';
import { Listing } from '../listing.model';
import { ListingsService } from '../listings.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  listings: Listing[];

  constructor(private listingsService: ListingsService) {
    this.listings = this.listingsService.listings;
  }

  ngOnInit() {
  }

}
