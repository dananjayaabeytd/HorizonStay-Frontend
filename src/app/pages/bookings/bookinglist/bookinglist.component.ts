import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking/booking.service';

@Component({
  selector: 'app-bookinglist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookinglist.component.html',
})
export class BookinglistComponent implements OnInit {
  email: any;
  bookings: any[] = [];

  constructor(
    private readonly bookingService: BookingService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUserBookings();
  }

  getUserBookings() {
    this.email = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!this.email || !token) {
      console.log('Hotel ID or Token is required');
      return;
    }

    try {
      this.bookingService
        .viewBookingsByEmail(this.email)
        .then((response: any) => {
          this.bookings = response;
        })
        .catch((error: any) => {
          console.log(error.message);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  viewBookingDetails(bookingId: any) {
    this.router.navigate(['/details', bookingId]);
  }
}
