import { TestBed } from '@angular/core/testing';
import { MarkupService } from './markup.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('MarkupService', () => {
  let service: MarkupService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000';
  const token = 'test-token';

  beforeEach(() => {
    // Configure the testing module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarkupService],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(MarkupService);
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

  // Test addMarkupToSeason method
  it('should add a markup to a season', () => {
    const seasonID = 1;
    const markupData = { name: 'Seasonal Markup' };
    const mockResponse = { success: true };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Call the service method
    service.addMarkupToSeason(seasonID, markupData, token).subscribe((response) => {
      // Expect the response to match the mock response
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP POST request
    const req = httpMock.expectOne(`${BASE_URL}/markup/${seasonID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    // Respond with mock data
    req.flush(mockResponse);
  });

  // Test getMarkupById method
  it('should get a markup by ID', () => {
    const markupID = 1;
    const mockResponse = { id: 1, name: 'Seasonal Markup' };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Call the service method
    service.getMarkupById(markupID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/markup/${markupID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test updateMarkup method
  it('should update a markup', () => {
    const markupID = 1;
    const markupData = { name: 'Updated Markup' };
    const mockResponse = { success: true };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Call the service method
    service.updateMarkup(markupID, markupData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/markup/update/${markupID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test deleteMarkup method
  it('should delete a markup', () => {
    const markupID = 1;
    const mockResponse = { success: true };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Call the service method
    service.deleteMarkup(markupID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP DELETE request
    const req = httpMock.expectOne(`${BASE_URL}/markup/delete/${markupID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test getMarkupsBySeasonId method
  it('should get all markups by season ID', () => {
    const seasonID = 1;
    const mockResponse = [{ id: 1, name: 'Seasonal Markup' }];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Call the service method
    service.getMarkupsBySeasonId(seasonID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/markup/season/${seasonID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });
});