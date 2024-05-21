import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditListingModalPageRoutingModule } from './edit-listing-modal-routing.module';

import { EditListingModalPage } from './edit-listing-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditListingModalPageRoutingModule
  ],
  declarations: [EditListingModalPage]
})
export class EditListingModalPageModule {}
