import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditListingModalComponent } from './edit-listing-modal.component';

describe('EditListingModalPage', () => {
  let component: EditListingModalComponent;
  let fixture: ComponentFixture<EditListingModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
