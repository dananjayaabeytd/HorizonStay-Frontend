import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../services/hotel/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updatehotel.component.html',
})

export class UpdatehotelComponent implements OnInit {
  hotelId: any;
  hotelData: any = {};
  errorMessage: string = '';
  imagePreviews: { src: string; name: string }[] = [];
  hotelImages: string[] = []; // Store image names instead of File objects

  constructor(
    private readonly hotelService: HotelService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getHotelById();
  }

  // Fetch the hotel details by ID
  async getHotelById() {
    this.hotelId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!this.hotelId || !token) {
      this.showError("Hotel ID or Token is required");
      return;
    }

    try {
      const hotelDataResponse = await this.hotelService.getHotelById(this.hotelId, token);
      const { hotelName, hotelDescription, hotelContactNumber, hotelCity, hotelCountry, hotelRating, hotelImages,hotelEmail } = hotelDataResponse;
      this.hotelData = { hotelName, hotelDescription, hotelContactNumber, hotelCity, hotelCountry, hotelRating,hotelEmail };
      
      // Populate image previews
      this.imagePreviews = hotelImages.map((img: string) => ({
        src: `http://localhost:5000/hotelImages/${img}`,  // Replace with the actual path to your server
        name: img,
      }));
      
      // Store the initial hotel images
      this.hotelImages = hotelImages;
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  // Handle file selection for images
  onSelectFile(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.imagePreviews = [];

      // Reset image names
      this.hotelImages = [];

      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push({ src: e.target.result, name: file.name });
        };
        reader.readAsDataURL(file);
        
        // Append the file name to hotelImages
        this.hotelImages.push(file.name);  // Assuming file.name is how your API identifies images
      }
    }
  }

  // Update the hotel details
  async updateHotel() {
    const confirmUpdate = confirm("Are you sure you want to update this hotel?");
    if (!confirmUpdate) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.showError("Token not found");
      return;
    }

    try {
      // Prepare the data to be sent to the API
      const updatedHotelData = {
        hotelID: this.hotelId,  // Make sure to include hotelID
        ...this.hotelData,
        hotelImages: this.hotelImages  // Use the array of image names
      };

      const res = await this.hotelService.updateHotel(this.hotelId, updatedHotelData, token);
      console.log(res);

      if (res.statusCode === 200) {
        this.router.navigate(['/hotels']); // Navigate to the hotel list after successful update
      } else {
        this.showError(res.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  // Show error messages
  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
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
