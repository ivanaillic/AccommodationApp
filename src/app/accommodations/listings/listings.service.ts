import { Injectable } from '@angular/core';
import { Listing } from './listing.model';

@Injectable({
  providedIn: 'root'
})
export class ListingsService {

  listings: Listing[] = [{
    id: 1,
    title: 'Divna Koliba u Planinama',
    description: 'Udobna koliba sa predivnim pogledom na planine.',
    price_per_day: 100,
    location: 'Planina',
    capacity_persons: 4,
    image_url: 'https://static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f_2048x1331_desktop_2.webp',
    user_id: 1
  }, {
    id: 2,
    title: 'Elegantan Stan u Centru Grada',
    description: 'Luksuzno namešten stan u blizini svih gradskih atrakcija.',
    price_per_day: 150,
    location: 'Grad',
    capacity_persons: 2,
    image_url: 'https://static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f_2048x1331_desktop_2.webp',
    user_id: 2
  }, {
    id: 3,
    title: 'Prostrana Kuća pored Jezera',
    description: 'Kuća sa velikim dvorištem i pristupom jezeru.',
    price_per_day: 200,
    location: 'Jezero',
    capacity_persons: 6,
    image_url: 'https://static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f_2048x1331_desktop_2.webp',
    user_id: 3
  }];

  //constructor() { }

  getListing(id: number): Listing | undefined {
    return this.listings.find((l) => l.id === id);
  }



}
