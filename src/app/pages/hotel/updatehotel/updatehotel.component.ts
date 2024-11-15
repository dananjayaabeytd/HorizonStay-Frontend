import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelService } from '../../../services/hotel/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';

interface ImageDetails {
  name: string;
  src: string;
  size: number;
  type: string;
}

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
  imagePreviews: ImageDetails[] = [];
  selectedFiles: File[] = [];
  hotelImages: string[] = [];

  constructor(
    private readonly hotelService: HotelService,
    private readonly router: Router,
    private alertService: AlertService,
    private readonly route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getHotelById();
  }

  async getHotelById() {
    this.hotelId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!this.hotelId || !token) {
      this.showError('Hotel ID or Token is required');
      return;
    }

    try {
      const hotelDataResponse = await this.hotelService.getHotelById(
        this.hotelId,
        token
      );
      const {
        hotelName,
        hotelDescription,
        hotelContactNumber,
        hotelCity,
        hotelCountry,
        hotelRating,
        hotelImages,
        hotelEmail,
      } = hotelDataResponse;
      this.hotelData = {
        hotelName,
        hotelDescription,
        hotelContactNumber,
        hotelCity,
        hotelCountry,
        hotelRating,
        hotelEmail,
      };

      // Populate image previews
      this.imagePreviews = hotelImages.map((img: string) => ({
        src: `http://localhost:5000/hotelImages/${img}`, // Replace with your server's image path
        name: img,
        size: 0, // Existing images may not have size/type, set to 0 or handle accordingly
        type: '',
      }));

      // Store the initial hotel images
      this.hotelImages = hotelImages;
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  onSelectFile(event: any): void {
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

  async updateHotel() {
    const confirmUpdate = await this.alertService.showConfirm(
      'Are you sure you want to Update Hotel Details?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );

    if (!confirmUpdate) return;

    const token = localStorage.getItem('token');

    if (!token) {
      this.showError('Token not found');
      return;
    }

    const updatedHotelData = {
      hotelID: this.hotelId,
      ...this.hotelData,
      hotelImages:
        this.selectedFiles.length > 0
          ? this.selectedFiles.map((file) => file.name)
          : this.hotelImages,
    };

    if (this.selectedFiles.length == 0) {
      try {
        console.log(updatedHotelData);
        const res = await this.hotelService.updateHotel(
          this.hotelId,
          updatedHotelData,
          token
        );
        console.log(this.selectedFiles);
        if (res.statusCode === 200) {
          this.alertService.showSuccess('Hotel updated successfully!');
          this.router.navigate(['/hotels']);
        } else {
          this.showError(res.message);
        }
      } catch (error: any) {
        this.showError(error.message);
      }
    } else {
      try {
        const res = await this.hotelService.updateHotel2(
          this.hotelId,
          updatedHotelData,
          this.selectedFiles,
          token
        );
        console.log(this.selectedFiles);
        if (res.statusCode === 200) {
          this.alertService.showSuccess('Hotel updated successfully!');
          this.router.navigate(['/hotels']);
        } else {
          this.showError(res.message);
        }
      } catch (error: any) {
        this.showError(error.message);
      }
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  scrollCarousel(direction: number) {
    const carousel = document.getElementById('imageCarousel');
    if (carousel) {
      const scrollAmount = direction * carousel.clientWidth;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  triggerFileInput() {
    document.getElementById('images')?.click();
  }
}
