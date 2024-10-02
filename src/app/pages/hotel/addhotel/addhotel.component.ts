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
  hotelRating: number = 4;
  hotelDescription: string = '';
  selectedFiles: File[] = [];
  hotelEmail: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
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

  async onSubmit() {
    try {
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

      await this.hotelService.addHotel(hotelData, this.selectedFiles, token);
      alert('Hotel added successfully!');
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Failed to add hotel.');
    }
  }
}