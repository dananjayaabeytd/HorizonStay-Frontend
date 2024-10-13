import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotel/hotel.service'; // Import the hotel service
import { AlertService } from '../../../services/alert/alert.service';

interface ImageDetails {
  name: string;
  src: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-addhotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addhotel.component.html',
})
export class AddhotelComponent implements OnInit {
  imagePreviews: ImageDetails[] = [];
  hotelName: string = '';
  hotelContactNumber: string = '';
  hotelCity: string = '';
  hotelCountry: string = '';
  hotelRating: number = 4;
  hotelDescription: string = '';
  selectedFiles: File[] = [];
  hotelEmail: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {}

  onselectFile(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.imagePreviews = [];

    this.selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push({
          name: file.name,
          src: e.target.result,
          size: file.size,
          type: file.type,
        });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  // async onSubmit() {
  //   try {
  //     const hotelData = {
  //       hotelName: this.hotelName,
  //       hotelEmail: this.hotelEmail,
  //       hotelDescription: this.hotelDescription,
  //       hotelContactNumber: this.hotelContactNumber,
  //       hotelCity: this.hotelCity,
  //       hotelCountry: this.hotelCountry,
  //       hotelRating: this.hotelRating,
  //       hotelImages: this.selectedFiles.map(file => file.name),
  //     };

  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('No Token Found');
  //     }

  //     const confirmRegistration = await this.alertService.showConfirm(
  //       'Are you sure you want to add this Hotel?',
  //       'Do you want to proceed?',
  //       'Yes, proceed',
  //       'No, cancel'
  //     );
  //     if (!confirmRegistration) {
  //       return;
  //     }
  //     await this.hotelService.addHotel(hotelData, this.selectedFiles, token);
  //     // alert('Hotel added successfully!');
  //     this.alertService.showSuccess('Hotel added successfully!');
  //   } catch (error) {
  //     console.error('Error adding hotel:', error);
  //     // alert('Failed to add hotel.');
  //     this.alertService.showError('Failed to add hotel.');
  //   }
  // }

  async onSubmit() {
    try {
      // Validate that all fields are filled
      if (!this.hotelName || !this.hotelEmail || !this.hotelDescription || !this.hotelContactNumber || !this.hotelCity || !this.hotelCountry || !this.hotelRating || this.selectedFiles.length === 0) {
        this.alertService.showError('All fields are required.');
        return;
      }
  
      const hotelData = {
        hotelName: this.hotelName,
        hotelEmail: this.hotelEmail,
        hotelDescription: this.hotelDescription,
        hotelContactNumber: this.hotelContactNumber,
        hotelCity: this.hotelCity,
        hotelCountry: this.hotelCountry,
        hotelRating: this.hotelRating,
        hotelImages: this.selectedFiles.map(file => file.name),
      };
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No Token Found');
      }
  
      const confirmRegistration = await this.alertService.showConfirm(
        'Are you sure you want to add this Hotel?',
        'Do you want to proceed?',
        'Yes, proceed',
        'No, cancel'
      );
      if (!confirmRegistration) {
        return;
      }
  
      await this.hotelService.addHotel(hotelData, this.selectedFiles, token);
      this.alertService.showSuccess('Hotel added successfully!');
    } catch (error: any) {
      console.error('Error adding hotel:', error);
  
      if (error.message === 'No Token Found') {
        this.alertService.showError('Authentication token is missing. Please log in again.');
      } else if (error.response && error.response.data && error.response.data.message) {
        this.alertService.showError(`Failed to add hotel: ${error.response.data.message}`);
      } else {
        this.alertService.showError('Failed to add hotel. Please try again later.');
      }
    }
  }

  scrollCarousel(direction: number) {
    const carousel = document.getElementById('imageCarousel');
    if (carousel) {
      const scrollAmount = direction * carousel.clientWidth; // Scroll by the width of one image
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  triggerFileInput() {
    document.getElementById('images')?.click();
  }
}