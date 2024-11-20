import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UsersService } from '../../../services/user/users.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let router: jasmine.SpyObj<Router>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, LoginComponent], // Import LoginComponent here
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if email or password is missing', async () => {
    component.email = '';
    component.password = '';
    await component.handleSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('Email and Password are required');
  });

  it('should login successfully and navigate to profile', async () => {
    const mockResponse = {
      statusCode: 200,
      token: 'test-token',
      userId: '1',
      role: 'USER',
      image: 'profile.png',
      email: 'test@example.com',
      address: '123 Street',
      name: 'Test User',
    };

    usersService.login.and.returnValue(Promise.resolve(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password123';
    await component.handleSubmit();

    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('userId')).toBe('1');
    expect(localStorage.getItem('role')).toBe('USER');
    expect(localStorage.getItem('profileImage')).toBe('profile.png');
    expect(localStorage.getItem('email')).toBe('test@example.com');
    expect(localStorage.getItem('address')).toBe('123 Street');
    expect(localStorage.getItem('userName')).toBe('Test User');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should show error if login fails', async () => {
    const mockResponse = {
      statusCode: 400,
      error: 'Invalid credentials',
    };

    usersService.login.and.returnValue(Promise.resolve(mockResponse));

    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    await component.handleSubmit();

    expect(alertService.showError).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should show error if login throws an error', async () => {
    const mockError = new Error('Network error');
    usersService.login.and.returnValue(Promise.reject(mockError));
    spyOn(component, 'showError');

    component.email = 'test@example.com';
    component.password = 'password123';
    await component.handleSubmit();

    expect(component.showError).toHaveBeenCalledWith('Network error');
  });
});