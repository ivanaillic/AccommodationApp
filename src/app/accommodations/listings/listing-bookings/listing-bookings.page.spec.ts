import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingBookingsPage } from './listing-bookings.page';

describe('ListingBookingsPage', () => {
  let component: ListingBookingsPage;
  let fixture: ComponentFixture<ListingBookingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
