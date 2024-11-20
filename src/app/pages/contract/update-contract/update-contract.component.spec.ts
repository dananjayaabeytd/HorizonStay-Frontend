import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UpdateContractComponent } from './update-contract.component';
import { ContractService } from '../../../services/contract/contract.service';
import { SeasonService } from '../../../services/season/season.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

describe('UpdateContractComponent', () => {
  let component: UpdateContractComponent;
  let fixture: ComponentFixture<UpdateContractComponent>;
  let contractService: jasmine.SpyObj<ContractService>;
  let seasonService: jasmine.SpyObj<SeasonService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const contractServiceSpy = jasmine.createSpyObj('ContractService', ['getContractById', 'updateContract']);
    const seasonServiceSpy = jasmine.createSpyObj('SeasonService', ['getSeasonsByContractId', 'updateSeason', 'addSeasonToContract', 'deleteSeason']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess', 'showConfirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, UpdateContractComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => '1' } } } },
        { provide: Router, useValue: routerSpy },
        { provide: ContractService, useValue: contractServiceSpy },
        { provide: SeasonService, useValue: seasonServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    contractService = TestBed.inject(ContractService) as jasmine.SpyObj<ContractService>;
    seasonService = TestBed.inject(SeasonService) as jasmine.SpyObj<SeasonService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(UpdateContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});