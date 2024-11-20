// users.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const BASE_URL = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      const store: { [key: string]: string } = {
        userId: '1',
        role: 'USER',
        profileImage: 'image.png',
        email: 'test@example.com',
        address: '123 Street',
        userName: 'Test User',
        token: 'test-token',
      };
      return store[key as keyof typeof store] || null;
    });
    
    // Manually call loadUser to ensure user is set
    service['loadUser']();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test login method
  it('should log in a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = { token: 'test-token' };

    service.login(email, password).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(mockResponse);
  });

  // Test register method
  it('should register a user', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' };
    const file = new File([''], 'test.png');
    const mockResponse = { success: true };

    service.register(userData, file).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    req.flush(mockResponse);
  });

  // Test updateUser method
  it('should update a user with file upload', async () => {
    const userId = '1';
    const userData = { name: 'Updated User' };
    const file = new File([''], 'test.png');
    const token = 'test-token';
    const mockResponse = { success: true };

    service.updateUser(userId, userData, file, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/admin/update/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body instanceof FormData).toBeTrue();

    req.flush(mockResponse);
  });

  // Test getAllUsers method
  it('should get all users', async () => {
    const token = 'test-token';
    const mockResponse = [{ id: '1', name: 'User One' }];

    service.getAllUsers(token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/admin/get-all-users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test getYourProfile method
  it('should get user profile', async () => {
    const token = 'test-token';
    const mockResponse = { id: '1', name: 'User One' };

    service.getYourProfile(token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/adminuser/get-profile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test getUsersById method
  it('should get a user by ID', async () => {
    const userId = '1';
    const token = 'test-token';
    const mockResponse = { id: '1', name: 'User One' };

    service.getUsersById(userId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/admin/get-users/${userId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test deleteUser method
  it('should delete a user', async () => {
    const userId = '1';
    const token = 'test-token';
    const mockResponse = { success: true };

    service.deleteUser(userId, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/admin/delete/${userId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    req.flush(mockResponse);
  });

  // Test updateUser2 method
  it('should update a user without file upload', async () => {
    const userId = '1';
    const userData = { name: 'Updated User' };
    const token = 'test-token';
    const mockResponse = { success: true };

    service.updateUser2(userId, userData, token).then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/admin/update/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body).toEqual(userData);

    req.flush(mockResponse);
  });

  // Test isAuthenticated method
  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBeTrue();
  });

  // Test isAdmin method
  it('should check if user is admin', () => {
    expect(service.isAdmin()).toBeFalse();
  });

  // Test isUser method
  it('should check if user is regular user', () => {
    expect(service.isUser()).toBeTrue();
  });

  // Test logOut method
  it('should log out the user', () => {
    spyOn(localStorage, 'clear');
    service.logOut();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  // Test getUser method
  it('should get the user details', () => {
    const user = service.getUser();
    expect(user).toEqual({
      id: '1',
      role: 'USER',
      profileImage: 'image.png',
      email: 'test@example.com',
      address: '123 Street',
      name: 'Test User',
    });
  });
});