import { TestBed } from '@angular/core/testing';
import { SupplementService } from './supplement.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('SupplementService', () => {
  let service: SupplementService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000';
  const token = 'test-token';

  beforeEach(() => {
    // Configure the testing module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplementService],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(SupplementService);
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

  // Test addSupplementToSeason method
  it('should add a supplement to a season', () => {
    const seasonID = 1;
    const supplementData = { name: 'Breakfast Supplement' };
    const mockResponse = { success: true };

    // Call the service method
    service.addSupplementToSeason(seasonID, supplementData, token).subscribe((response) => {
      // Expect the response to match the mock response
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP POST request
    const req = httpMock.expectOne(`${BASE_URL}/supplement/${seasonID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    // Respond with mock data
    req.flush(mockResponse);
  });

  // Test getSupplementById method
  it('should get a supplement by ID', () => {
    const supplementID = 1;
    const mockResponse = { id: 1, name: 'Breakfast Supplement' };

    // Call the service method
    service.getSupplementById(supplementID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/supplement/${supplementID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test updateSupplement method
  it('should update a supplement', () => {
    const supplementID = 1;
    const supplementData = { name: 'Updated Supplement' };
    const mockResponse = { success: true };

    // Call the service method
    service.updateSupplement(supplementID, supplementData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/supplement/update/${supplementID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test deleteSupplement method
  it('should delete a supplement', () => {
    const supplementID = 1;
    const mockResponse = { success: true };

    // Call the service method
    service.deleteSupplement(supplementID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP DELETE request
    const req = httpMock.expectOne(`${BASE_URL}/supplement/delete/${supplementID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test getSupplementsBySeasonId method
  it('should get all supplements by season ID', () => {
    const seasonID = 1;
    const mockResponse = [{ id: 1, name: 'Breakfast Supplement' }];

    // Call the service method
    service.getSupplementsBySeasonId(seasonID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/supplement/season/${seasonID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });
});