import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { ContractService } from '../../../services/contract/contract.service';
import { SearchService } from '../../../services/search/search.service';
import { BookingService } from '../../../services/booking/booking.service';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let contractService: jasmine.SpyObj<ContractService>;
  let searchService: jasmine.SpyObj<SearchService>;
  let bookingService: jasmine.SpyObj<BookingService>;

  beforeEach(async () => {
    const contractServiceSpy = jasmine.createSpyObj('ContractService', ['searchContracts']);
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['updateHotels']);
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['setBookingData', 'getBookingData']);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, SearchComponent],
      providers: [
        { provide: ContractService, useValue: contractServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: BookingService, useValue: bookingServiceSpy }
      ]
    }).compileComponents();

    contractService = TestBed.inject(ContractService) as jasmine.SpyObj<ContractService>;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle adult dropdown', () => {
    component.toggleDropdown('adult');
    expect(component.showAdultDropdown).toBeTrue();
    expect(component.showChildDropdown).toBeFalse();
  });

  it('should toggle child dropdown', () => {
    component.toggleDropdown('child');
    expect(component.showChildDropdown).toBeTrue();
    expect(component.showAdultDropdown).toBeFalse();
  });

  it('should select adult count', () => {
    component.selectCount('adult', 3);
    expect(component.adultCount).toBe(3);
    expect(component.showAdultDropdown).toBeFalse();
  });

  it('should select child count', () => {
    component.selectCount('child', 2);
    expect(component.childCount).toBe(2);
    expect(component.showChildDropdown).toBeFalse();
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2024-09-30');
    expect(formattedDate).toBe('2024-09-30');
  });

  it('should search and update hotels', async () => {
    const mockResponse = [{ id: 1, name: 'Hotel Test' }];
    contractService.searchContracts.and.returnValue(Promise.resolve(mockResponse));
    bookingService.getBookingData.and.returnValue({
      location: 'colombo',
      checkInDate: '2024-09-30',
      checkOutDate: '2025-11-05',
      adultCount: 2,
      childCount: 1
    });

    await component.search();

    expect(contractService.searchContracts).toHaveBeenCalledWith(
      'colombo',
      '2024-09-30',
      '2025-11-05',
      2,
      1
    );
    expect(bookingService.setBookingData).toHaveBeenCalled();
    expect(searchService.updateHotels).toHaveBeenCalledWith(mockResponse);
  });
});