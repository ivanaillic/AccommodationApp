import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../listing.model';
@Component({
  selector: 'app-listing-element',
  templateUrl: './listing-element.component.html',
  styleUrls: ['./listing-element.component.scss'],
})
export class ListingElementComponent implements OnInit {
  @Input() listing: Listing = {
    id: 2,
    title: 'Planinska kuća',
    description: 'Rustična planinska kuća u šumskom ambijentu.',
    price_per_day: 80,
    location: 'Zlatibor, Srbija',
    capacity_persons: 6,
    image_url: 'https://www.pexels.com/photo/view-of-tourist-resort-338504/',
    user_id: 2
  };
  constructor() { }

  ngOnInit() { }

}
