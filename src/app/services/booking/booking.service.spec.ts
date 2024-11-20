import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { HttpClient } from '@angular/common/http';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importing HttpClientTestingModule
      providers: [BookingService],
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifying that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set booking data', () => {
    const data = { name: 'John Doe' };
    service.setBookingData(data);
    expect(service.getBookingData()).toEqual(data);
  });

  it('should clear booking data', () => {
    service.setBookingData({ name: 'John Doe' });
    service.clearBookingData();
    expect(service.getBookingData()).toEqual({});
  });

  it('should calculate amount', () => {
    const payload = { nights: 3 };
    const mockResponse = { amount: 300 };

    service.calculateAmount(payload).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/booking/calculate-amount'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should make a booking', () => {
    const bookingData = { name: 'John Doe' };
    const mockResponse = { success: true };

    service.makeBooking(bookingData).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/booking/add');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update availability', () => {
    const bookingData = { date: '2023-10-10' };
    const mockResponse = { success: true };

    service.updateAvailability(bookingData).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/booking/availability'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should view bookings by email', () => {
    const email = 'test@example.com';
    const mockResponse = [{ id: 1, name: 'John Doe' }];

    service.viewBookingsByEmail(email).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:5000/booking/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should admin update booking by id', () => {
    const bookingId = 1;
    const bookingData = { name: 'John Doe' };
    const token = 'test-token';
    const mockResponse = { success: true };

    service
      .adminUpdateBookingById(bookingId, bookingData, token)
      .then((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `http://localhost:5000/booking/admin/update/${bookingId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });

  it('should admin delete booking by id', () => {
    const bookingId = 1;
    const token = 'test-token';
    const mockResponse = { success: true };

    service.adminDeleteBookingById(bookingId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:5000/booking/admin/delete/${bookingId}`
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });

  it('should admin get booking by id', () => {
    const bookingId = 1;
    const token = 'test-token';
    const mockResponse = { id: 1, name: 'John Doe' };

    service.adminGetBookingById(bookingId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:5000/booking/admin/get/${bookingId}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
  });
});
