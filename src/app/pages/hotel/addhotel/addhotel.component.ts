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
 
}
