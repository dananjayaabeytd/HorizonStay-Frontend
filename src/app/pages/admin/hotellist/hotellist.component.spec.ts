import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HotellistComponent } from './hotellist.component';
import { HotelService } from '../../../services/hotel/hotel.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

describe('HotellistComponent', () => {
  let component: HotellistComponent;
  let fixture: ComponentFixture<HotellistComponent>;
  let hotelService: jasmine.SpyObj<HotelService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const hotelServiceSpy = jasmine.createSpyObj('HotelService', ['getAllHotels', 'deleteHotel']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showConfirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, HotellistComponent],
      providers: [
        { provide: HotelService, useValue: hotelServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    hotelService = TestBed.inject(HotelService) as jasmine.SpyObj<HotelService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(HotellistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hotels on init', async () => {
    const mockHotels = [{ id: 1, name: 'Hotel 1' }];
    hotelService.getAllHotels.and.returnValue(Promise.resolve({ statusCode: 200, hotelList: mockHotels }));

    await component.loadHotels();

    expect(component.hotels).toEqual(mockHotels);
  });

  it('should navigate to update hotel', () => {
    component.navigateToUpdate('1');

    expect(router.navigate).toHaveBeenCalledWith(['/updatehotel', '1']);
  });

  it('should navigate to add contract', () => {
    component.navigateToAddContract('1');

    expect(router.navigate).toHaveBeenCalledWith(['/contract-add', '1']);
  });

  it('should navigate to contract list', () => {
    component.navigateToContractList('1');

    expect(router.navigate).toHaveBeenCalledWith(['hotel/contracts', '1']);
  });

  it('should delete hotel successfully', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    hotelService.deleteHotel.and.returnValue(Promise.resolve());

    await component.deleteHotel('1');

    expect(hotelService.deleteHotel).toHaveBeenCalledWith('1', jasmine.any(String));
    expect(hotelService.getAllHotels).toHaveBeenCalled();
  });

  it('should not delete hotel if confirmation is cancelled', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(false));

    await component.deleteHotel('1');

    expect(hotelService.deleteHotel).not.toHaveBeenCalled();
  });
});