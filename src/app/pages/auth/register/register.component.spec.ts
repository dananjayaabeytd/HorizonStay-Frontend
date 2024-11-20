import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UsersService } from '../../../services/user/users.service';
import { AlertService } from '../../../services/alert/alert.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['isAdmin', 'register']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess', 'showConfirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAdmin on init', () => {
    userService.isAdmin.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdmin).toBeTrue();
  });

  it('should show error if form is invalid on submit', async () => {
    component.formData.name = '';
    await component.handleSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('Please fill in all fields.');
  });

  // it('should show error if no file is selected on submit', async () => {
  //   component.formData = {
  //     name: 'Test User',
  //     email: 'test@example.com',
  //     address: '123 Test St',
  //     password: 'password',
  //     role: 'USER',
  //     image: '',
  //     nic: '123456789V',
  //   };
  //   await component.handleSubmit();
  //   expect(component.errorMessage).toBe('Please select a file.');
  // });

  it('should navigate to login if token is not found', async () => {
    component.formData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      password: 'password',
      role: 'USER',
      image: '',
      nic: '123456789V',
    };
    component.selectedFile = new File([''], 'test.jpg');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.register.and.returnValue(of({ statusCode: 200 }).toPromise());
    spyOn(localStorage, 'getItem').and.returnValue(null);

    await component.handleSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error if user already exists', async () => {
    component.formData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      password: 'password',
      role: 'USER',
      image: '',
      nic: '123456789V',
    };
    component.selectedFile = new File([''], 'test.jpg');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.register.and.returnValue(of({ statusCode: 409 }).toPromise());
    spyOn(localStorage, 'getItem').and.returnValue('token');

    await component.handleSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('User Already Exists with this email.');
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to users on successful registration', async () => {
    component.formData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      password: 'password',
      role: 'USER',
      image: '',
      nic: '123456789V',
    };
    component.selectedFile = new File([''], 'test.jpg');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.register.and.returnValue(of({ statusCode: 200 }).toPromise());
    spyOn(localStorage, 'getItem').and.returnValue('token');

    await component.handleSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should show error on registration failure', async () => {
    component.formData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test St',
      password: 'password',
      role: 'USER',
      image: '',
      nic: '123456789V',
    };
    component.selectedFile = new File([''], 'test.jpg');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.register.and.returnValue(throwError({ message: 'Registration failed' }).toPromise());
    spyOn(localStorage, 'getItem').and.returnValue('token');

    await component.handleSubmit();
    expect(component.errorMessage).toBe('Registration failed');
  });
});