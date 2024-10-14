import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomTypeService } from '../../../../../services/roomType/room-type.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../../services/alert/alert.service';

@Component({
  selector: 'app-roomtype',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-type.component.html',
})
export class RoomTypeComponent implements OnInit {
  newRoomTypeForm: FormGroup;
  roomTypes: any[] = [];
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  seasonID: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private roomTypeService: RoomTypeService
  ) {
    this.newRoomTypeForm = this.fb.group({
      roomTypeName: ['', Validators.required],
      numberOfRooms: [0, Validators.required],
      maxNumberOfPersons: [0, Validators.required],
      price: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  async loadRoomTypes() {
    try {
      this.seasonID = this.route.snapshot.paramMap.get('id');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.roomTypeService
        .getRoomTypesBySeasonId(this.seasonID, token)
        .toPromise();

      console.log(response);
      if (response) {
        this.roomTypes = response.map((roomType: any) => ({
          ...roomType,
          form: this.fb.group({
            roomTypeName: [roomType.roomTypeName, Validators.required],
            numberOfRooms: [roomType.numberOfRooms, Validators.required],
            maxNumberOfPersons: [
              roomType.maxNumberOfPersons,
              Validators.required,
            ],
            price: [roomType.price, Validators.required],
          }),
        }));
      } else {
        console.log('No Room Types found.');
      }
    } catch (error: any) {
      console.error('Error loading room types:', error);
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.imagePreviews = this.selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
  }

  async onSubmitRoomTypeDetails(roomType: any) {
    if (roomType.form.invalid) {
      this.alertService.showError('All fields are required');
      console.log('Form is invalid');
      return;
    }

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const roomTypeData = {
        roomTypeName: roomType.form.value.roomTypeName,
        numberOfRooms: roomType.form.value.numberOfRooms,
        maxNumberOfPersons: roomType.form.value.maxNumberOfPersons,
        price: roomType.form.value.price,
        roomTypeImages: roomType.roomTypeImages,
      };

      await this.roomTypeService
        .updateRoomType(
          roomType.roomTypeID,
          roomTypeData,
          token
        )
        .toPromise();
      console.log('Room Type updated successfully');
      this.alertService.showSuccess('Room Type Updated Successfully');
      await this.loadRoomTypes();
    } catch (error) {
      console.error('Error updating room type:', error);
    }
  }

  async onAddNewRoomType() {
    if (this.newRoomTypeForm.invalid) {
      console.log('Form is invalid');
      this.alertService.showError('All fields are required');
      return;
    }

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const newRoomTypeData = {
        ...this.newRoomTypeForm.value,
        seasonID: this.seasonID,
      };

      await this.roomTypeService
        .addRoomTypeToSeason(
          this.seasonID,
          newRoomTypeData,
          this.selectedFiles,
          token
        )
        .toPromise();
      this.alertService.showSuccess('Room Type added successfully');
      console.log('New Room Type added successfully');
      this.newRoomTypeForm.reset();
      this.imagePreviews = []; // Clear previews
      this.selectedFiles = []; // Clear file input
      await this.loadRoomTypes(); // Reload room types to refresh the list
    } catch (error) {
      this.alertService.showError('Error occurred while adding Room Type');
      console.error('Error adding new room type:', error);
    }
  }

  async onDeleteRoomType(roomTypeID: number) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to Delete this Discount?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    if (!confirmDelete) return;

    if (confirmDelete) {
      try {
        await this.roomTypeService
          .deleteRoomType(roomTypeID, token)
          .toPromise();
        console.log('Room Type deleted successfully');
        this.alertService.showSuccess('Room Type Deleted Successfully');
        await this.loadRoomTypes(); // Reload room types to refresh the list
      } catch (error) {
        console.error('Error deleting room type:', error);
        this.alertService.showError('Error occurred while deleting Room Type');
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById(
      'roomTypeImages'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
