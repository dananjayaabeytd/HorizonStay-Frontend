import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AddContractComponent } from './add-contract.component';
import { ContractService } from '../../../services/contract/contract.service';
import { SeasonService } from '../../../services/season/season.service';
import { RoomTypeService } from '../../../services/roomType/room-type.service';
import { DiscountService } from '../../../services/discount/discount.service';
import { MarkupService } from '../../../services/markup/markup.service';
import { SupplementService } from '../../../services/supplement/supplement.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

describe('AddContractComponent', () => {
  let component: AddContractComponent;
  let fixture: ComponentFixture<AddContractComponent>;
  let contractService: jasmine.SpyObj<ContractService>;
  let seasonService: jasmine.SpyObj<SeasonService>;
  let roomTypeService: jasmine.SpyObj<RoomTypeService>;
  let discountService: jasmine.SpyObj<DiscountService>;
  let markupService: jasmine.SpyObj<MarkupService>;
  let supplementService: jasmine.SpyObj<SupplementService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const contractServiceSpy = jasmine.createSpyObj('ContractService', ['addContract']);
    const seasonServiceSpy = jasmine.createSpyObj('SeasonService', ['addSeasonToContract']);
    const roomTypeServiceSpy = jasmine.createSpyObj('RoomTypeService', ['addRoomTypeToSeason']);
    const discountServiceSpy = jasmine.createSpyObj('DiscountService', ['addDiscountToSeason']);
    const markupServiceSpy = jasmine.createSpyObj('MarkupService', ['addMarkupToSeason']);
    const supplementServiceSpy = jasmine.createSpyObj('SupplementService', ['addSupplementToSeason']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, AddContractComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => '1' } } } },
        { provide: ContractService, useValue: contractServiceSpy },
        { provide: SeasonService, useValue: seasonServiceSpy },
        { provide: RoomTypeService, useValue: roomTypeServiceSpy },
        { provide: DiscountService, useValue: discountServiceSpy },
        { provide: MarkupService, useValue: markupServiceSpy },
        { provide: SupplementService, useValue: supplementServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    contractService = TestBed.inject(ContractService) as jasmine.SpyObj<ContractService>;
    seasonService = TestBed.inject(SeasonService) as jasmine.SpyObj<SeasonService>;
    roomTypeService = TestBed.inject(RoomTypeService) as jasmine.SpyObj<RoomTypeService>;
    discountService = TestBed.inject(DiscountService) as jasmine.SpyObj<DiscountService>;
    markupService = TestBed.inject(MarkupService) as jasmine.SpyObj<MarkupService>;
    supplementService = TestBed.inject(SupplementService) as jasmine.SpyObj<SupplementService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(AddContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});