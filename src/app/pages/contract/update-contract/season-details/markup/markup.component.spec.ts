import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MarkupComponent } from './markup.component';
import { MarkupService } from '../../../../../services/markup/markup.service';
import { AlertService } from '../../../../../services/alert/alert.service';

describe('MarkupComponent', () => {
  let component: MarkupComponent;
  let fixture: ComponentFixture<MarkupComponent>;
  let markupService: jasmine.SpyObj<MarkupService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const markupServiceSpy = jasmine.createSpyObj('MarkupService', ['getMarkupsBySeasonId', 'updateMarkup', 'addMarkupToSeason', 'deleteMarkup']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [MarkupComponent, ReactiveFormsModule],
      providers: [
        { provide: MarkupService, useValue: markupServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();

    markupService = TestBed.inject(MarkupService) as jasmine.SpyObj<MarkupService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.markupForm).toBeDefined();
    expect(component.newMarkupForm).toBeDefined();
  });

  it('should load markups on init', async () => {
    const mockMarkups = [{ id: 1, markupName: 'Test', percentage: 10 }];
    markupService.getMarkupsBySeasonId.and.returnValue(of(mockMarkups));

    await component.loadMarkups();

    expect(component.markups.length).toBe(1);
    expect(component.markups[0].markupName).toBe('Test');
  });

  it('should handle error when loading markups', async () => {
    markupService.getMarkupsBySeasonId.and.returnValue(throwError('Error'));

    await component.loadMarkups();

    expect(component.markups.length).toBe(0);
  });

  it('should show error if markup form is invalid on submit', async () => {
    component.markupForm.controls['markupName'].setValue('');
    await component.onSubmitMarkupDetails({ form: component.markupForm });

    expect(alertService.showError).toHaveBeenCalledWith('All fields are required');
  });

  it('should update markup on valid form submit', async () => {
    const mockMarkup = { id: 1, form: component.markupForm };
    component.markupForm.controls['markupName'].setValue('Test');
    component.markupForm.controls['percentage'].setValue(10);
    markupService.updateMarkup.and.returnValue(of({}));

    await component.onSubmitMarkupDetails(mockMarkup);

    expect(alertService.showSuccess).toHaveBeenCalledWith('Markup Updated Successfully');
  });

  it('should add new markup on valid form submit', async () => {
    component.newMarkupForm.controls['markupName'].setValue('New Markup');
    component.newMarkupForm.controls['percentage'].setValue(15);
    markupService.addMarkupToSeason.and.returnValue(of({}));

    await component.onAddNewMarkup();

    expect(alertService.showSuccess).toHaveBeenCalledWith('Markup Added Successfully');
  });

  it('should delete markup', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    markupService.deleteMarkup.and.returnValue(of({}));

    await component.onDeleteMarkup(1);

    expect(alertService.showSuccess).toHaveBeenCalledWith('Markup Deleted Successfully');
  });
});