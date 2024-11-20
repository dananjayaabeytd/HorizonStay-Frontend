import { TestBed } from '@angular/core/testing';
import { RoomTypeService } from './room-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('RoomTypeService', () => {
  let service: RoomTypeService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000'; // Backend URL
  const token = 'test-token';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  beforeEach(() => {
    // Configure the testing module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomTypeService],
    });

    // Inject the service and HttpTestingController
    service = TestBed.inject(RoomTypeService);
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

  // Test addRoomTypeToSeason method
  it('should add a room type to a season', () => {
    const seasonID = 1;
    const roomTypeData = { name: 'Deluxe Room' };
    const files: File[] = [];
    const mockResponse = { success: true };

    // Call the service method
    service.addRoomTypeToSeason(seasonID, roomTypeData, files, token).subscribe((response) => {
      // Expect the response to match the mock response
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP POST request
    const req = httpMock.expectOne(`${BASE_URL}/roomtype/${seasonID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    // Respond with mock data
    req.flush(mockResponse);
  });

  // Test updateRoomType method
  it('should update a room type', () => {
    const roomTypeID = 1;
    const roomTypeData = { name: 'Updated Room' };
    const mockResponse = { success: true };

    // Call the service method
    service.updateRoomType(roomTypeID, roomTypeData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP PUT request
    const req = httpMock.expectOne(`${BASE_URL}/roomtype/update/${roomTypeID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test getRoomTypeById method
  it('should get a room type by ID', () => {
    const roomTypeID = 1;
    const mockResponse = { id: 1, name: 'Deluxe Room' };

    // Call the service method
    service.getRoomTypeById(roomTypeID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/roomtype/${roomTypeID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test deleteRoomType method
  it('should delete a room type', () => {
    const roomTypeID = 1;
    const mockResponse = { success: true };

    // Call the service method
    service.deleteRoomType(roomTypeID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP DELETE request
    const req = httpMock.expectOne(`${BASE_URL}/roomtype/delete/${roomTypeID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });

  // Test getRoomTypesBySeasonId method
  it('should get all room types by season ID', () => {
    const seasonID = 1;
    const mockResponse = [{ id: 1, name: 'Deluxe Room' }];

    // Call the service method
    service.getRoomTypesBySeasonId(seasonID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect an HTTP GET request
    const req = httpMock.expectOne(`${BASE_URL}/roomtype/season/${seasonID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();

    req.flush(mockResponse);
  });
});