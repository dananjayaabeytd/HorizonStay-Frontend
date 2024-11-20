import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiscountService } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule to mock HTTP requests
      providers: [DiscountService], // Provide the service under test
    });
    service = TestBed.inject(DiscountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifying that no outstanding requests are left
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add discount to season', () => {
    const seasonID = 1;
    const discountData = { name: 'Summer Discount', amount: 10 };
    const token = 'test-token';
    const mockResponse = { success: true };

    service.addDiscountToSeason(seasonID, discountData, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/discount/${seasonID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse); // Respond with mock data
  });

  it('should get discount by ID', () => {
    const discountID = 1;
    const token = 'test-token';
    const mockResponse = { id: 1, name: 'Summer Discount', amount: 10 };

    service.getDiscountById(discountID, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/discount/${discountID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });

  it('should update discount by ID', () => {
    const discountID = 1;
    const discountData = { name: 'Winter Discount', amount: 15 };
    const token = 'test-token';
    const mockResponse = { success: true };

    service.updateDiscount(discountID, discountData, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/discount/update/${discountID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });

  it('should delete discount by ID', () => {
    const discountID = 1;
    const token = 'test-token';
    const mockResponse = { success: true };

    service.deleteDiscount(discountID, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/discount/delete/${discountID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });

  it('should get all discounts by season ID', () => {
    const seasonID = 1;
    const token = 'test-token';
    const mockResponse = [
      { id: 1, name: 'Summer Discount', amount: 10 },
      { id: 2, name: 'Winter Discount', amount: 15 }
    ];

    service.getDiscountsBySeasonId(seasonID, token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/discount/season/${seasonID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });
});
