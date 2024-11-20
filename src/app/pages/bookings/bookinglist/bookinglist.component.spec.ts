import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookinglistComponent } from './bookinglist.component';
import { BookingService } from '../../../services/booking/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('BookinglistComponent', () => {
  let component: BookinglistComponent;
  let fixture: ComponentFixture<BookinglistComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['viewBookingsByEmail']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, BookinglistComponent],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => 'test@example.com' } } } }
      ]
    }).compileComponents();

    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(BookinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user bookings on init', async () => {
    const mockBookings = [{ id: 1, name: 'Booking 1' }];
    bookingService.viewBookingsByEmail.and.returnValue(Promise.resolve(mockBookings));

    await component.getUserBookings();

    expect(component.bookings).toEqual(mockBookings);
  });

  it('should navigate to booking details', () => {
    component.viewBookingDetails(1);

    expect(router.navigate).toHaveBeenCalledWith(['/details', 1]);
  });
});