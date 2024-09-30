import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingcompleteComponent } from './bookingcomplete.component';

describe('BookingcompleteComponent', () => {
  let component: BookingcompleteComponent;
  let fixture: ComponentFixture<BookingcompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingcompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingcompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
