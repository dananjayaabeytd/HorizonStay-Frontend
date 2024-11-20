import { TestBed } from '@angular/core/testing';
import { ContractService } from './contract.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('ContractService', () => {
  let service: ContractService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000/api/contracts';
  const token = 'test-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [ContractService],
    });
    service = TestBed.inject(ContractService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that no outstanding HTTP requests remain
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test searchContracts method
  it('should search for contracts', async () => {
    const location = 'Test Location';
    const checkInDate = '2023-01-01';
    const checkOutDate = '2023-01-05';
    const adults = 2;
    const children = 1;
    const mockResponse = [{ id: 1, location: 'Test Location' }];

    service.searchContracts(location, checkInDate, checkOutDate, adults, children).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/search?location=${location}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  // Test addContract method
  it('should add a new contract', () => {
    const hotelID = 1;
    const contractData = { name: 'New Contract' };
    const mockResponse = { success: true };

    service.addContract(hotelID, contractData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/${hotelID}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test getContractById method
  it('should get a contract by ID', () => {
    const contractID = 1;
    const mockResponse = { id: 1, name: 'Existing Contract' };

    service.getContractById(contractID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/${contractID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test updateContract method
  it('should update a contract', () => {
    const contractID = 1;
    const contractData = { name: 'Updated Contract' };
    const mockResponse = { success: true };

    service.updateContract(contractID, contractData, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/update/${contractID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test updateContractStatus method
  it('should update contract status', () => {
    const contractID = 1;
    const mockResponse = { success: true };

    service.updateContractStatus(contractID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/update/status/${contractID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test deleteContract method
  it('should delete a contract', () => {
    const contractID = 1;
    const mockResponse = { success: true };

    service.deleteContract(contractID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/delete/${contractID}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  // Test getContractsByHotelId method
  it('should get all contracts by hotel ID', () => {
    const hotelID = 1;
    const mockResponse = [{ id: 1, name: 'Contract 1' }];

    service.getContractsByHotelId(hotelID, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/hotel/${hotelID}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });
});