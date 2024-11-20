import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RoomTypeComponent } from './room-type.component';
import { RoomTypeService } from '../../../../../services/roomType/room-type.service';
import { AlertService } from '../../../../../services/alert/alert.service';

describe('RoomTypeComponent', () => {
  let component: RoomTypeComponent;
  let fixture: ComponentFixture<RoomTypeComponent>;
  let roomTypeService: jasmine.SpyObj<RoomTypeService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const roomTypeServiceSpy = jasmine.createSpyObj('RoomTypeService', ['getRoomTypesBySeasonId', 'updateRoomType', 'addRoomTypeToSeason', 'deleteRoomType']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showError', 'showSuccess', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [RoomTypeComponent, ReactiveFormsModule],
      providers: [
        { provide: RoomTypeService, useValue: roomTypeServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();

    roomTypeService = TestBed.inject(RoomTypeService) as jasmine.SpyObj<RoomTypeService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.newRoomTypeForm).toBeDefined();
  });

  it('should load room types on init', async () => {
    const mockRoomTypes = [{ id: 1, roomTypeName: 'Test', numberOfRooms: 10, maxNumberOfPersons: 2, price: 100 }];
    roomTypeService.getRoomTypesBySeasonId.and.returnValue(of(mockRoomTypes));

    await component.loadRoomTypes();

    expect(component.roomTypes.length).toBe(1);
    expect(component.roomTypes[0].roomTypeName).toBe('Test');
  });

  it('should handle error when loading room types', async () => {
    roomTypeService.getRoomTypesBySeasonId.and.returnValue(throwError('Error'));

    await component.loadRoomTypes();

    expect(component.roomTypes.length).toBe(0);
  });

  it('should show error if room type form is invalid on submit', async () => {
    component.newRoomTypeForm.controls['roomTypeName'].setValue('');
    await component.onSubmitRoomTypeDetails({ form: component.newRoomTypeForm });

    expect(alertService.showError).toHaveBeenCalledWith('All fields are required');
  });

  it('should update room type on valid form submit', async () => {
    const mockRoomType = { roomTypeID: 1, form: component.newRoomTypeForm };
    component.newRoomTypeForm.controls['roomTypeName'].setValue('Test');
    component.newRoomTypeForm.controls['numberOfRooms'].setValue(10);
    component.newRoomTypeForm.controls['maxNumberOfPersons'].setValue(2);
    component.newRoomTypeForm.controls['price'].setValue(100);
    roomTypeService.updateRoomType.and.returnValue(of({}));

    await component.onSubmitRoomTypeDetails(mockRoomType);

    expect(alertService.showSuccess).toHaveBeenCalledWith('Room Type Updated Successfully');
  });

  it('should add new room type on valid form submit', async () => {
    component.newRoomTypeForm.controls['roomTypeName'].setValue('New Room Type');
    component.newRoomTypeForm.controls['numberOfRooms'].setValue(5);
    component.newRoomTypeForm.controls['maxNumberOfPersons'].setValue(3);
    component.newRoomTypeForm.controls['price'].setValue(200);
    
    // Mock selected files
    component.selectedFiles = [new File([''], 'test.jpg')];
    
    roomTypeService.addRoomTypeToSeason.and.returnValue(of({ statusCode: 200 }));
  
    await component.onAddNewRoomType();
  
    expect(alertService.showSuccess).toHaveBeenCalledWith('Room Type added successfully');
  });

  it('should delete room type', async () => {
    alertService.showConfirm.and.returnValue(Promise.resolve(true));
    roomTypeService.deleteRoomType.and.returnValue(of({}));

    await component.onDeleteRoomType(1);

    expect(alertService.showSuccess).toHaveBeenCalledWith('Room Type Deleted Successfully');
  });
});