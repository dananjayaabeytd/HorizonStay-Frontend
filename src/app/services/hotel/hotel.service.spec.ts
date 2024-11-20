import { TestBed } from '@angular/core/testing';
import { HotelService } from './hotel.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('HotelService', () => {
  let service: HotelService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000';
  const token = 'test-token';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  beforeEach(() => {
    // Configure the testing module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HotelService],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(HotelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    // Test if the service is created successfully
    expect(service).toBeTruthy();
  });

  // Test addHotel method
  it('should add a hotel', async () => {
    const hotelData = { name: 'Test Hotel' };
    const files: File[] = [];
    const mockResponse = { success: true };

    // Call the service method
    service.addHotel(hotelData, files, token).then((response) => {
      // Expect the response to match the mock response
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP POST request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body.has('hotel')).toBeTrue();

    // Respond with mock data
    req.flush(mockResponse);
  });

  // Test updateHotel2 method
  it('should update a hotel with files', async () => {
    const hotelId = '1';
    const hotelData = { name: 'Updated Hotel' };
    const files: File[] = [];
    const mockResponse = { success: true };

    // Call the service method
    service.updateHotel2(hotelId, hotelData, files, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/update/v2/${hotelId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body.has('hotel')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test getAllHotels method
  it('should get all hotels', async () => {
    const mockResponse = [{ id: '1', name: 'Test Hotel' }];

    // Call the service method
    service.getAllHotels(token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/get-all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test getHotelById method
  it('should get a hotel by ID', async () => {
    const hotelId = '1';
    const mockResponse = { id: '1', name: 'Test Hotel' };

    // Call the service method
    service.getHotelById(hotelId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/get/${hotelId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test updateHotel method
  it('should update a hotel', async () => {
    const hotelId = '1';
    const hotelData = { name: 'Updated Hotel' };
    const mockResponse = { success: true };

    // Call the service method
    service.updateHotel(hotelId, hotelData, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/update/${hotelId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test deleteHotel method
  it('should delete a hotel', async () => {
    const hotelId = '1';
    const mockResponse = { success: true };

    // Call the service method
    service.deleteHotel(hotelId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP DELETE request
    const req = httpMock.expectOne(`${BASE_URL}/admin/hotel/delete/${hotelId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });
});