import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UpdatehotelComponent } from './updatehotel.component';
import { HotelService } from '../../../services/hotel/hotel.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('UpdatehotelComponent', () => {
  let component: UpdatehotelComponent;
  let fixture: ComponentFixture<UpdatehotelComponent>;
  let hotelService: jasmine.SpyObj<HotelService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const hotelServiceSpy = jasmine.createSpyObj('HotelService', ['getHotelById', 'updateHotel', 'updateHotel2']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showConfirm', 'showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, UpdatehotelComponent],
      providers: [
        { provide: HotelService, useValue: hotelServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => '1' } } } }
      ]
    }).compileComponents();

    hotelService = TestBed.inject(HotelService) as jasmine.SpyObj<HotelService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(UpdatehotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hotel data on init', async () => {
    const mockHotelData = {
      hotelName: 'Test Hotel',
      hotelDescription: 'Test Description',
      hotelContactNumber: '1234567890',
      hotelCity: 'Test City',
      hotelCountry: 'Test Country',
      hotelRating: 5,
      hotelImages: ['image1.jpg', 'image2.jpg'],
      hotelEmail: 'test@example.com'
    };
    hotelService.getHotelById.and.returnValue(Promise.resolve(mockHotelData));

    await component.getHotelById();

    expect(component.hotelData).toEqual({
      hotelName: 'Test Hotel',
      hotelDescription: 'Test Description',
      hotelContactNumber: '1234567890',
      hotelCity: 'Test City',
      hotelCountry: 'Test Country',
      hotelRating: 5,
      hotelEmail: 'test@example.com'
    });
    expect(component.imagePreviews.length).toBe(2);
  });

  it('should update hotel without new images', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.updateHotel.and.returnValue(Promise.resolve({ statusCode: 200 }));

    component.hotelId = '1';
    component.hotelData = { hotelName: 'Updated Hotel' };
    component.selectedFiles = [];

    await component.updateHotel();

    expect(alertService.showSuccess).toHaveBeenCalledWith('Hotel updated successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['/hotels']);
  });

  it('should update hotel with new images', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.updateHotel2.and.returnValue(Promise.resolve({ statusCode: 200 }));

    component.hotelId = '1';
    component.hotelData = { hotelName: 'Updated Hotel' };
    component.selectedFiles = [new File([], 'image1.jpg')];

    await component.updateHotel();

    expect(alertService.showSuccess).toHaveBeenCalledWith('Hotel updated successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['/hotels']);
  });

  // it('should show error if hotel ID or token is missing', async () => {
  //   spyOn(component, 'showError');
  
  //   component.hotelId = null;
  //   await component.getHotelById();
  
  //   expect(component.showError).toHaveBeenCalledWith('Hotel ID or Token is required');
  // });
});