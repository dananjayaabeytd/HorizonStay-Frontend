import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { SupplementService } from '../../../../../services/supplement/supplement.service';
import { AlertService } from '../../../../../services/alert/alert.service';
import { SupplementComponent } from './supplement.component';
import { fakeAsync, tick } from '@angular/core/testing';

describe('SupplementComponent', () => {
  let component: SupplementComponent;
  let fixture: ComponentFixture<SupplementComponent>;
  let mockActivatedRoute;
  let mockRouter;
  let mockSupplementService: { getSupplementsBySeasonId: { and: { returnValue: (arg0: Observable<{ supplementName: string; price: number; }[]>) => void; }; }; addSupplementToSeason: { and: { returnValue: (arg0: Observable<{}>) => void; }; }; };
  let mockAlertService: { showError: any; showSuccess: any; };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockSupplementService = jasmine.createSpyObj(['getSupplementsBySeasonId', 'updateSupplement', 'addSupplementToSeason', 'deleteSupplement']);
    mockAlertService = jasmine.createSpyObj(['showError', 'showSuccess', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [SupplementComponent, CommonModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: SupplementService, useValue: mockSupplementService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load supplements on init', async () => {
    const mockResponse = [{ supplementName: 'Test', price: 100 }];
    mockSupplementService.getSupplementsBySeasonId.and.returnValue(of(mockResponse));

    await component.loadSupplements();

    expect(component.supplements.length).toBe(1);
    expect(component.supplements[0].supplementName).toBe('Test');
  });

  // it('should show error if token is not found on loadSupplements', async () => {
  //   spyOn(localStorage, 'getItem').and.returnValue(null);

  //   await component.loadSupplements();

  //   expect(mockAlertService.showError).toHaveBeenCalledWith('Token not found');
  // });

  it('should add new supplement', async () => {
    component.newSupplementForm.setValue({ supplementName: 'New Supplement', price: 200 });
    mockSupplementService.addSupplementToSeason.and.returnValue(of({}));

    await component.onAddNewSupplement();

    expect(mockAlertService.showSuccess).toHaveBeenCalledWith('supplement Added Successfully');
  });
});