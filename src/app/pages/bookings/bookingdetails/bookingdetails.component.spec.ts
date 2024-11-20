import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BookingdetailsComponent } from './bookingdetails.component';
import { BookingService } from '../../../services/booking/booking.service';

describe('BookingdetailsComponent', () => {
  let component: BookingdetailsComponent;
  let bookingService: jasmine.SpyObj<BookingService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const bookingServiceMock = jasmine.createSpyObj('BookingService', ['adminGetBookingById']);

    await TestBed.configureTestingModule({
      imports: [BookingdetailsComponent], // Standalone components are added here
      providers: [
        { provide: BookingService, useValue: bookingServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '123' : null) } },
          },
        },
      ],
    }).compileComponents();

    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    route = TestBed.inject(ActivatedRoute);
    component = TestBed.createComponent(BookingdetailsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch booking details on init', async () => {
    const mockBookingDetails = { id: 123, name: 'Sample Booking' };

    bookingService.adminGetBookingById.and.returnValue(Promise.resolve(mockBookingDetails));

    await component.ngOnInit();

    expect(bookingService.adminGetBookingById).toHaveBeenCalledWith(123, jasmine.any(String));
    expect(component.booking).toEqual(mockBookingDetails);
  });
  
});
