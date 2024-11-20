import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserslistComponent } from './userslist.component';
import { UsersService } from '../../../services/user/users.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('UserslistComponent', () => {
  let component: UserslistComponent;
  let fixture: ComponentFixture<UserslistComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['getAllUsers', 'deleteUser', 'getUser']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showConfirm', 'showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, UserslistComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UserslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', async () => {
    const mockUsers = [{ name: 'John Doe' }];
    userService.getAllUsers.and.returnValue(Promise.resolve({ statusCode: 200, systemUsersList: mockUsers }));

    await component.loadUsers();

    expect(component.users).toEqual(mockUsers);
  });

  it('should show error if no users found', async () => {
    userService.getAllUsers.and.returnValue(Promise.resolve({ statusCode: 404 }));

    await component.loadUsers();

    expect(component.errorMessage).toBe('No users found.');
  });

  it('should delete user successfully', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    userService.deleteUser.and.returnValue(Promise.resolve());

    await component.deleteUser('1');

    expect(alertService.showSuccess).toHaveBeenCalledWith('User deleted successfully.');
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should filter users based on search term', () => {
    component.users = [{ name: 'John Doe' }, { name: 'Jane Smith' }];
    component.searchTerm = 'john';

    const filteredUsers = component.filteredUsers;

    expect(filteredUsers).toEqual([{ name: 'John Doe' }]);
  });

  it('should navigate to update user', () => {
    component.navigateToUpdate('1');

    expect(router.navigate).toHaveBeenCalledWith(['/update', '1']);
  });

  it('should navigate to view user bookings', () => {
    component.viewUserBookings('1');

    expect(router.navigate).toHaveBeenCalledWith(['/bookings', '1']);
  });
});