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
onSelectFile($event: Event) {
throw new Error('Method not implemented.');
}
updateHotel() {
throw new Error('Method not implemented.');
}
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
  }
}
