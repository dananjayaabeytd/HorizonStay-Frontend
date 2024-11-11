import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search/search.service'; // Adjust the path as necessary
import { SearchComponent } from '../../landing/search/search.component';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking/booking.service';
@Component({
  selector: 'app-resultlist',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './resultlist.component.html',
})
export class ResultlistComponent {
  hotels: any[] = [];
  priceToCustomer: number = 0;

  constructor(
    private searchService: SearchService, 
    private router: Router,
    private bookingService: BookingService
  ) {}

  

  ngOnInit() {
    const bookingData = this.bookingService.getBookingData();

    const checkInDate = bookingData.checkInDate
      ? this.formatDate(bookingData.checkInDate)
      : '';
    const checkOutDate = bookingData.checkOutDate
      ? this.formatDate(bookingData.checkOutDate)
      : '';

      const noOfDays = this.calculateDaysBetween(checkInDate, checkOutDate);
      const noOfPersons = bookingData.adultCount + bookingData.childCount

    this.searchService.currentHotels.subscribe((hotels) => {
      this.hotels = hotels.map((hotel: any) => {
        hotel.lowestPriceRoom = this.getLowestPriceRoom(hotel.roomTypeDTO);
        hotel.priceToCustomer =
          ((hotel.markupDTO.percentage * hotel.lowestPriceRoom.price) +
            hotel.lowestPriceRoom.price) *
          noOfDays * noOfPersons;
        return hotel;
      });
    });
  }

  viewDetails(number: number) {
    this.router.navigate(['/resultmore', number]);
  }

  getLowestPriceRoom(roomTypes: any[]) {
    if (!roomTypes || roomTypes.length === 0) {
      return null;
    }
    return roomTypes.reduce((prev, curr) =>
      prev.price < curr.price ? prev : curr
    );
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
  calculateDaysBetween(checkInDate: string, checkOutDate: string): number {
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const timeDifference = date2.getTime() - date1.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference;
  }

}
