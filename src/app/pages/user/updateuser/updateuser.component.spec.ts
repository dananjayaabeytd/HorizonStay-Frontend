import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UpdateuserComponent } from './updateuser.component';
import { UsersService } from '../../../services/user/users.service';
import { AlertService } from '../../../services/alert/alert.service';

describe('UpdateuserComponent', () => {
  let component: UpdateuserComponent;
  let fixture: ComponentFixture<UpdateuserComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['getUsersById', 'updateUser', 'updateUser2', 'isAdmin']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showConfirm', 'showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, UpdateuserComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '123' } }
          }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(UpdateuserComponent);
    component = fixture.componentInstance;

    // Mock the isAdmin method to return true
    userService.isAdmin.and.returnValue(true);

    // Mock the getUsersById method to return a valid user object
    userService.getUsersById.and.returnValue(Promise.resolve({
      systemUsers: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        address: '123 Main St',
        nic: '123456789V',
        image: 'profile.jpg'
      }
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', async () => {
    await component.getUserById();
    expect(component.userData.name).toBe('John Doe');
    expect(component.userData.email).toBe('john.doe@example.com');
    expect(component.userData.role).toBe('admin');
    expect(component.userData.address).toBe('123 Main St');
    expect(component.userData.nic).toBe('123456789V');
    expect(component.imageUrl).toBe('http://localhost:5000/profileImages/profile.jpg');
  });

  it('should show error if user ID or token is missing', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    await component.getUserById();
    expect(component.errorMessage).toBe('User ID or Token is Required');
  });

  it('should update user successfully', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.updateUser.and.returnValue(Promise.resolve({ statusCode: 200, message: 'Success' }));
    spyOn(localStorage, 'getItem').and.returnValue('token');

    component.selectedFile = new File([''], 'filename');
    await component.updateUser();

    expect(alertService.showSuccess).toHaveBeenCalledWith('User Updated Successfully');
  });

  it('should show error if update fails', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.updateUser.and.returnValue(Promise.resolve({ statusCode: 400, message: 'Error' }));
    spyOn(localStorage, 'getItem').and.returnValue('token');

    component.selectedFile = new File([''], 'filename');
    await component.updateUser();

    expect(alertService.showError).toHaveBeenCalledWith('Error Occured When updating');
  });
});