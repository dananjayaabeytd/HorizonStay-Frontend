import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DiscountComponent } from './discount.component';
import { DiscountService } from '../../../../../services/discount/discount.service';
import { AlertService } from '../../../../../services/alert/alert.service';

describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  let discountService: jasmine.SpyObj<DiscountService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const discountServiceSpy = jasmine.createSpyObj('DiscountService', [
      'getDiscountsBySeasonId',
      'updateDiscount',
      'addDiscountToSeason',
      'deleteDiscount',
    ]);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showError',
      'showSuccess',
      'showConfirm',
    ]);

    await TestBed.configureTestingModule({
      imports: [DiscountComponent, ReactiveFormsModule],
      providers: [
        { provide: DiscountService, useValue: discountServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: Router, useValue: {} },
      ],
    }).compileComponents();

    discountService = TestBed.inject(
      DiscountService
    ) as jasmine.SpyObj<DiscountService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.discountForm).toBeDefined();
    expect(component.newDiscountForm).toBeDefined();
  });

  it('should load discounts on init', async () => {
    const mockDiscounts = [{ id: 1, discountName: 'Test', percentage: 10 }];
    discountService.getDiscountsBySeasonId.and.returnValue(of(mockDiscounts));

    await component.loadDiscounts();

    expect(component.discounts.length).toBe(1);
    expect(component.discounts[0].discountName).toBe('Test');
  });

  it('should handle error when loading discounts', async () => {
    discountService.getDiscountsBySeasonId.and.returnValue(throwError('Error'));

    await component.loadDiscounts();

    expect(component.discounts.length).toBe(0);
  });

  it('should show error if discount form is invalid on submit', async () => {
    component.discountForm.controls['discountName'].setValue('');
    await component.onSubmitDiscountDetails({ form: component.discountForm });

    expect(alertService.showError).toHaveBeenCalledWith(
      'All fields are required'
    );
  });

  it('should update discount on valid form submit', async () => {
    const mockDiscount = { id: 1, form: component.discountForm };
    component.discountForm.controls['discountName'].setValue('Test');
    component.discountForm.controls['percentage'].setValue(10);
    discountService.updateDiscount.and.returnValue(of({}));

    await component.onSubmitDiscountDetails(mockDiscount);

    expect(alertService.showSuccess).toHaveBeenCalledWith(
      'Discount Updated Successfully'
    );
  });

  it('should add new discount on valid form submit', async () => {
    component.newDiscountForm.controls['discountName'].setValue('New Discount');
    component.newDiscountForm.controls['percentage'].setValue(15);
    discountService.addDiscountToSeason.and.returnValue(of({}));

    await component.onAddNewDiscount();

    expect(alertService.showSuccess).toHaveBeenCalledWith(
      'Discount Added Successfully'
    );
  });

  it('should delete discount', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    discountService.deleteDiscount.and.returnValue(of({}));

    await component.onDeleteDiscount(1);

    expect(alertService.showSuccess).toHaveBeenCalledWith(
      'Markup Deleted Successfully'
    );
  });
});
