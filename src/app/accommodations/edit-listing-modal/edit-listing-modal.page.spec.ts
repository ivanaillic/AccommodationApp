import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditListingModalPage } from './edit-listing-modal.page';

describe('EditListingModalPage', () => {
  let component: EditListingModalPage;
  let fixture: ComponentFixture<EditListingModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListingModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
