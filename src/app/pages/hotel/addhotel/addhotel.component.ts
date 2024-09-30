import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotel/hotel.service'; // Import the hotel service

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
  hotelRating: number = 4.5;
  hotelDescription: string = '';
  selectedFiles: File[] = [];
  hotelEmail: String = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private hotelService: HotelService // Inject the hotel service
  ) {}

  ngOnInit() {}

  onselectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagePreviews = []; // Clear previous previews
      this.selectedFiles = Array.from(input.files); // Store selected files
      for (const file of this.selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push({
            name: file.name,
            src: e.target.result,
            size: file.size,
            type: file.type,
          });
          // Trigger change detection manually
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async onSubmit(): Promise<void> {
    // Prepare hotel data
    const hotelData = {
      hotelName: this.hotelName,
      hotelDescription: this.hotelDescription,
      hotelContactNumber: this.hotelContactNumber,
      hotelCity: this.hotelCity,
      hotelCountry: this.hotelCountry,
      hotelRating: this.hotelRating,
      hotelEmail: this.hotelEmail,
      hotelImages: this.selectedFiles.map((file) => file.name), // Assuming you send filenames
    };

    const token = localStorage.getItem('token'); // Get token from local storage

    if (token) {
      try {
        const response = await this.hotelService.addHotel(hotelData, token);
        console.log('Hotel added successfully:', response);
      } catch (error) {
        console.error('Error adding hotel:', error);
      }
    } else {
      console.error('User not authenticated');
    }
  }
}
