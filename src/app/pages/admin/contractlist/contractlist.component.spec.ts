import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ContractlistComponent } from './contractlist.component';
import { ContractService } from '../../../services/contract/contract.service';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

describe('ContractlistComponent', () => {
  let component: ContractlistComponent;
  let fixture: ComponentFixture<ContractlistComponent>;
  let contractService: jasmine.SpyObj<ContractService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const contractServiceSpy = jasmine.createSpyObj('ContractService', ['getContractsByHotelId', 'deleteContract', 'updateContractStatus']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showConfirm']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ContractlistComponent],
      providers: [
        { provide: ContractService, useValue: contractServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => '1' } } } }
      ]
    }).compileComponents();

    contractService = TestBed.inject(ContractService) as jasmine.SpyObj<ContractService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ContractlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contracts on init', async () => {
    const mockContracts = [{ id: 1, name: 'Contract 1' }];
    contractService.getContractsByHotelId.and.returnValue(of(mockContracts));

    await component.loadContracts();

    expect(component.contracts).toEqual(mockContracts);
  });

  it('should navigate to update contract', () => {
    component.navigateToUpdateContract('1', '1');

    expect(router.navigate).toHaveBeenCalledWith(['/hotel/1/update-contract/1']);
  });

  it('should not delete contract if confirmation is cancelled', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(false));

    await component.deleteContract('1');

    expect(contractService.deleteContract).not.toHaveBeenCalled();
  });

  it('should toggle contract status successfully', async () => {
    const mockContracts = [{ id: 1, isActive: true }];
    component.contracts = mockContracts;
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    contractService.getContractsByHotelId.and.returnValue(of(mockContracts));

    await component.toggleContractStatus(1);

    expect(contractService.updateContractStatus).toHaveBeenCalledWith(1, jasmine.any(String));
    expect(contractService.getContractsByHotelId).toHaveBeenCalled();
    expect(component.contracts[0].isActive).toBe(false);
  });

  it('should not toggle contract status if confirmation is cancelled', async () => {
    const mockContracts = [{ id: 1, isActive: true }];
    component.contracts = mockContracts;
    alertService.showConfirm.and.returnValue(Promise.resolve(false));

    await component.toggleContractStatus(1);

    expect(contractService.updateContractStatus).not.toHaveBeenCalled();
    expect(component.contracts[0].isActive).toBe(true);
  });
});