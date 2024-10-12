import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomTypeService } from '../../../../../services/roomType/room-type.service';
import { CommonModule } from '@angular/common';

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
      const response = await this.roomTypeService.getRoomTypesBySeasonId(this.seasonID, token).toPromise();

      console.log(response)
      if (response) {
        this.roomTypes = response.map((roomType: any) => ({
          ...roomType,
          form: this.fb.group({
            roomTypeName: [roomType.roomTypeName, Validators.required],
            numberOfRooms: [roomType.numberOfRooms, Validators.required],
            maxNumberOfPersons: [roomType.maxNumberOfPersons, Validators.required],
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
    this.imagePreviews = this.selectedFiles.map((file) => URL.createObjectURL(file));
  }

  async onSubmitRoomTypeDetails(roomType: any) {
    if (roomType.form.invalid) {
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
      };

      console.log('Room Type Form Data:', roomTypeData);

      // Update room type using service
      await this.roomTypeService.updateRoomType(roomType.roomTypeID, roomTypeData, this.selectedFiles, token).toPromise();
      console.log('Room Type updated successfully');
      await this.loadRoomTypes(); // Reload room types to refresh the list
    } catch (error) {
      console.error('Error updating room type:', error);
    }
  }

  async onAddNewRoomType() {
    if (this.newRoomTypeForm.invalid) {
      console.log('Form is invalid');
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
      // Add new room type using service
      await this.roomTypeService.addRoomTypeToSeason(this.seasonID, newRoomTypeData, this.selectedFiles, token).toPromise();
      console.log('New Room Type added successfully');
      this.newRoomTypeForm.reset();
      this.imagePreviews = []; // Clear previews
      this.selectedFiles = []; // Clear file input
      await this.loadRoomTypes(); // Reload room types to refresh the list
    } catch (error) {
      console.error('Error adding new room type:', error);
    }
  }

  async onDeleteRoomType(roomTypeID: number) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      await this.roomTypeService.deleteRoomType(roomTypeID, token).toPromise();
      console.log('Room Type deleted successfully');
      await this.loadRoomTypes(); // Reload room types to refresh the list
    } catch (error) {
      console.error('Error deleting room type:', error);
    }
  }
}
