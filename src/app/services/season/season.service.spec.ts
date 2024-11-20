import { TestBed } from '@angular/core/testing';
import { SeasonService } from './season.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('SeasonService', () => {
  let service: SeasonService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000';
  const token = 'test-token';
  const authHeaders = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  beforeEach(() => {
    // Configure the testing module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SeasonService],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(SeasonService);
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

  // Test addSeasonToContract method
  it('should add a season to a contract', () => {
    const contractID = 1;
    const seasonData = { name: 'Summer Season' };
    const mockResponse = { success: true };

    // Call the service method
    service.addSeasonToContract(contractID, seasonData, token).subscribe((response) => {
      // Expect the response to match the mock response
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP POST request
    const req = httpMock.expectOne(`${BASE_URL}/api/seasons/${contractID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    // Respond with mock data
    req.flush(mockResponse);
  });

  // Test getSeasonById method
  it('should get a season by ID', () => {
    const seasonID = 1;
    const mockResponse = { id: 1, name: 'Summer Season' };

    // Call the service method
    service.getSeasonById(seasonID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/api/seasons/${seasonID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test updateSeason method
  it('should update a season', () => {
    const seasonID = 1;
    const seasonData = { name: 'Updated Season' };
    const mockResponse = { success: true };

    // Call the service method
    service.updateSeason(seasonID, seasonData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/api/seasons/update/${seasonID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test deleteSeason method
  it('should delete a season', () => {
    const seasonID = 1;
    const mockResponse = { success: true };

    // Call the service method
    service.deleteSeason(seasonID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP DELETE request
    const req = httpMock.expectOne(`${BASE_URL}/api/seasons/delete/${seasonID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test getSeasonsByContractId method
  it('should get all seasons by contract ID', () => {
    const contractID = 1;
    const mockResponse = [{ id: 1, name: 'Summer Season' }];

    // Call the service method
    service.getSeasonsByContractId(contractID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/api/seasons/contract/${contractID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });
});