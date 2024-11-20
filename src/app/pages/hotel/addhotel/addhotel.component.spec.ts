import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddhotelComponent } from './addhotel.component';
import { HotelService } from '../../../services/hotel/hotel.service';
import { AlertService } from '../../../services/alert/alert.service';
import { ChangeDetectorRef } from '@angular/core';

describe('AddhotelComponent', () => {
  let component: AddhotelComponent;
  let fixture: ComponentFixture<AddhotelComponent>;
  let hotelService: jasmine.SpyObj<HotelService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const hotelServiceSpy = jasmine.createSpyObj('HotelService', ['addHotel']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess', 'showConfirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddhotelComponent, FormsModule],
      providers: [
        { provide: HotelService, useValue: hotelServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    hotelService = TestBed.inject(HotelService) as jasmine.SpyObj<HotelService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddhotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if form is invalid on submit', async () => {
    component.hotelName = '';
    await component.onSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('All fields are required.');
  });

  it('should show error if no token is found', async () => {
    component.hotelName = 'Test Hotel';
    component.hotelEmail = 'test@example.com';
    component.hotelDescription = 'Test Description';
    component.hotelContactNumber = '1234567890';
    component.hotelCity = 'Test City';
    component.hotelCountry = 'Test Country';
    component.hotelRating = 4;
    component.selectedFiles = [new File([''], 'test.jpg')];
    spyOn(localStorage, 'getItem').and.returnValue(null);

    await component.onSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('Authentication token is missing. Please log in again.');
  });

  it('should show error if hotel already exists', async () => {
    component.hotelName = 'Test Hotel';
    component.hotelEmail = 'test@example.com';
    component.hotelDescription = 'Test Description';
    component.hotelContactNumber = '1234567890';
    component.hotelCity = 'Test City';
    component.hotelCountry = 'Test Country';
    component.hotelRating = 4;
    component.selectedFiles = [new File([''], 'test.jpg')];
    spyOn(localStorage, 'getItem').and.returnValue('token');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.addHotel.and.returnValue(of({ statusCode: 409 }).toPromise());

    await component.onSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('Hotel already exists with same name or email');
  });

  it('should navigate to hotels on successful addition', async () => {
    component.hotelName = 'Test Hotel';
    component.hotelEmail = 'test@example.com';
    component.hotelDescription = 'Test Description';
    component.hotelContactNumber = '1234567890';
    component.hotelCity = 'Test City';
    component.hotelCountry = 'Test Country';
    component.hotelRating = 4;
    component.selectedFiles = [new File([''], 'test.jpg')];
    spyOn(localStorage, 'getItem').and.returnValue('token');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.addHotel.and.returnValue(of({ statusCode: 200 }).toPromise());

    await component.onSubmit();
    expect(alertService.showSuccess).toHaveBeenCalledWith('Hotel added successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['/hotels']);
  });

  it('should show error on addition failure', async () => {
    component.hotelName = 'Test Hotel';
    component.hotelEmail = 'test@example.com';
    component.hotelDescription = 'Test Description';
    component.hotelContactNumber = '1234567890';
    component.hotelCity = 'Test City';
    component.hotelCountry = 'Test Country';
    component.hotelRating = 4;
    component.selectedFiles = [new File([''], 'test.jpg')];
    spyOn(localStorage, 'getItem').and.returnValue('token');
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.addHotel.and.returnValue(throwError({ message: 'Addition failed' }).toPromise());

    await component.onSubmit();
    expect(alertService.showError).toHaveBeenCalledWith('Failed to add hotel. Please try again later.');
  });
});