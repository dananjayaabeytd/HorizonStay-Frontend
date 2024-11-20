import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { UsersService } from '../../../services/user/users.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['getYourProfile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ProfileComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile info on init', async () => {
    const mockProfileInfo = { systemUsers: { image: 'test.jpg' } };
    userService.getYourProfile.and.returnValue(Promise.resolve(mockProfileInfo));
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');

    await component.ngOnInit();

    expect(component.profileInfo).toEqual(mockProfileInfo);
    expect(component.imageUrl).toBe('http://localhost:5000/profileImages/test.jpg');
  });

  it('should show error if no token is found', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(component, 'showError');

    await component.ngOnInit();

    expect(component.showError).toHaveBeenCalledWith('No Token Found');
  });

  it('should navigate to update profile', () => {
    component.updateProfile('1');

    expect(router.navigate).toHaveBeenCalledWith(['/update', '1']);
  });

  it('should show error message', () => {
    component.showError('Test Error');

    expect(component.errorMessage).toBe('Test Error');
    setTimeout(() => {
      expect(component.errorMessage).toBe('');
    }, 3000);
  });
});