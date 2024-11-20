import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { SeasonDetailsComponent } from './season-details.component';
import { DiscountComponent } from './discount/discount.component';
import { MarkupComponent } from './markup/markup.component';
import { SupplementComponent } from './supplement/supplement.component';
import { RoomTypeComponent } from './room-type/room-type.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('SeasonDetailsComponent', () => {
  let component: SeasonDetailsComponent;
  let fixture: ComponentFixture<SeasonDetailsComponent>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      queryParams: of({ hotelID: '1', contractID: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, DiscountComponent, MarkupComponent, SupplementComponent, RoomTypeComponent, SeasonDetailsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(SeasonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hotelID and contractID from query params', () => {
    expect(component.hotelID).toBe('1');
    expect(component.contractID).toBe('1');
  });

  it('should select component', () => {
    component.selectComponent('discount');
    expect(component.selectedComponent).toBe('discount');
  });

  it('should toggle dropdown visibility', () => {
    component.dropdownVisible = false;
    component.toggleDropdown();
    expect(component.dropdownVisible).toBe(true);
    component.toggleDropdown();
    expect(component.dropdownVisible).toBe(false);
  });

  it('should navigate to contracts', () => {
    component.navigateToContracts(1);
    expect(router.navigate).toHaveBeenCalledWith(['/hotel/contracts/1']);
  });

  it('should navigate to update contract main', () => {
    component.navigateToUpdateContractMain(1, 1);
    expect(router.navigate).toHaveBeenCalledWith(['/hotel/1/update-contract/1']);
  });
});