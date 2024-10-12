import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../services/contract/contract.service';
import { SearchService } from '../../../services/search/search.service'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking/booking.service'; // Import BookingService

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  location = 'colombo';
  checkInDate = '2025-11-10';
  checkOutDate = '2025-12-31';
  adultCount = 2;
  childCount = 1;
  showAdultDropdown = false;
  showChildDropdown = false;
  counts = [0, 1, 2, 3, 4]; // You can modify this array as needed

  constructor(
    private contractService: ContractService,
    private searchService: SearchService,
    private bookingService: BookingService
  ) {}

  toggleDropdown(type: 'adult' | 'child'): void {
    if (type === 'adult') {
      this.showAdultDropdown = !this.showAdultDropdown;
      this.showChildDropdown = false; // Close the child dropdown if it's open
    } else {
      this.showChildDropdown = !this.showChildDropdown;
      this.showAdultDropdown = false; // Close the adult dropdown if it's open
    }
  }

  selectCount(type: 'adult' | 'child', count: number): void {
    if (type === 'adult') {
      this.adultCount = count;
      this.showAdultDropdown = false; // Close dropdown after selection
    } else {
      this.childCount = count;
      this.showChildDropdown = false; // Close dropdown after selection
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  async search() {
    try {
      const formattedCheckInDate = this.formatDate(this.checkInDate);
      const formattedCheckOutDate = this.formatDate(this.checkOutDate);

      const response = await this.contractService.searchContracts(
        this.location,
        formattedCheckInDate,
        formattedCheckOutDate,
        this.adultCount,
        this.childCount
      );

      // const response = await this.contractService.searchContracts(
      //   'colombo',
      //   '2025-11-10',
      //   '2025-12-31',
      //   2,
      //   1
      // );

      // Save search data in BookingService
      this.bookingService.setBookingData({
        location: this.location,
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        adultCount: this.adultCount,
        childCount: this.childCount,
      });

      const datatoPass = this.bookingService.getBookingData()

      console.log('data to be passed ->',datatoPass)


      this.searchService.updateHotels(response); // Update the hotels data in the service
    } catch (error) {
      console.error('Error searching contracts:', error);
    }
  }
}
