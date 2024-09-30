import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookingdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookingdetails.component.html',
})
export class BookingdetailsComponent implements OnInit {
  booking: any;

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBookingDetails();
  }

  getBookingDetails(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (bookingId && token) {
      this.bookingService
        .adminGetBookingById(bookingId, token)
        .then((response: any) => {
          this.booking = response;
        })
        .catch((error: any) => {
          console.log(error.message);
        });
    } else {
      console.log('Booking ID and token are required');
    }
  }
}
