import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component'; // Import your standalone NavComponent
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from '../../services/user/users.service';
import { of } from 'rxjs';

// Mock UsersService
class MockUsersService {
  isAuthenticated() {
    return true;
  }
  isAdmin() {
    return true;
  }
  isUser() {
    return true;
  }
  logOut() {
    // simulate logout behavior
  }
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let userService: MockUsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavComponent],  // Import NavComponent instead of declaring it
      providers: [{ provide: UsersService, useClass: MockUsersService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  // Test Case 1: Component Initialization
  it('should initialize user information on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'profileImage':
          return 'profile.jpg';
        case 'userName':
          return 'John Doe';
        case 'userId':
          return '1';
        case 'email':
          return 'john.doe@example.com';
        default:
          return null;
      }
    });

    component.ngOnInit();

    expect(component.userImage).toBe('http://localhost:5000/profileImages/profile.jpg');
    expect(component.userName).toBe('John Doe');
    expect(component.isAuthenticated).toBeTrue();
    expect(component.isAdmin).toBeTrue();
    expect(component.isUser).toBeTrue();
    expect(component.userID).toBe('1');
    expect(component.userEmail).toBe('john.doe@example.com');
  });

  // Test Case 2: Should show "Get started" button when user is not authenticated
  // it('should show "Get started" button when user is not authenticated', () => {
  //   userService.isAuthenticated = () => false;
  //   fixture.detectChanges();
  //   const button = fixture.debugElement.nativeElement.querySelector('button');
  //   expect(button.textContent).toBe('Get started');
  // });

  // Test Case 3: Should show "Dashboard" link when user is an admin
  it('should show "Dashboard" link when user is an admin', () => {
    userService.isAuthenticated = () => true;
    userService.isAdmin = () => true;
    fixture.detectChanges();
    const dashboardLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/dashboard"]');
    expect(dashboardLink).toBeTruthy();
  });

  // Test Case 4: Should show user profile image when authenticated
  it('should show user profile image when authenticated', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => 'profile.jpg');
    component.ngOnInit();
    fixture.detectChanges();
    const img = fixture.debugElement.nativeElement.querySelector('img');
    expect(img.src).toContain('http://localhost:5000/profileImages/profile.jpg');
  });

  // Test Case 5: Should log out user when "Sign out" is clicked
  it('should log out user when "Sign out" is clicked', () => {
    spyOn(userService, 'logOut');
    component.logout();
    expect(userService.logOut).toHaveBeenCalled();
    expect(component.isAuthenticated).toBeFalse();
    expect(component.isAdmin).toBeFalse();
    expect(component.isUser).toBeFalse();
  });

  // Test Case 6: Should navigate to user bookings page when "My Bookings" is clicked
  it('should navigate to user bookings page when "My Bookings" is clicked', () => {
    spyOn(component['router'], 'navigate');
    const userEmail = 'john.doe@example.com';
    component.viewUserBookings(userEmail);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/bookings', userEmail]);
  });

  // Test Case 7: Should show "Login" and "Register" links when user is not authenticated
  // it('should show "Login" and "Register" links when user is not authenticated', () => {
  //   userService.isAuthenticated = () => false;
  //   fixture.detectChanges();
  //   const loginLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/login"]');
  //   const registerLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/register"]');
  //   expect(loginLink).toBeTruthy();
  //   expect(registerLink).toBeTruthy();
  // });

  // Test Case 8: Should show "Sign Up" link when user is authenticated
  it('should show "Sign Up" link when user is authenticated', () => {
    userService.isAuthenticated = () => true;
    fixture.detectChanges();
    const signUpLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/register"]');
    expect(signUpLink).toBeTruthy();
  });

  // Test Case 9: Should toggle the navbar on mobile view
  it('should toggle navbar when mobile menu button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button[data-collapse-toggle="navbar-sticky"]');
    button.click();
    fixture.detectChanges();
    const navbar = fixture.debugElement.nativeElement.querySelector('#navbar-sticky');
    expect(navbar).toBeTruthy();
  });
});
