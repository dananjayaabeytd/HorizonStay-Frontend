import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../services/hotel/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotellist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotellist.component.html',
})
export class HotellistComponent implements OnInit {
  hotels: any[] = [];

  constructor(
    private hotelService: HotelService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  async loadHotels() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.hotelService.getAllHotels(token);
      if (response && response.statusCode === 200 && response.hotelList) {
        this.hotels = response.hotelList;
      } else {
        console.log('No Hotels found.');
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
  

  navigateToUpdate(hotelId: string) {
    this.router.navigate(['/updatehotel', hotelId]);
  }

  navigateToAddContract(hotelId: string) {
    this.router.navigate(['/addcontract', hotelId]);
  }

  navigateToContractList(hotelId: string) {
    this.router.navigate(['hotel/contracts', hotelId]);
  }

  async deleteHotel(hotelId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const token: any = localStorage.getItem('token');
        await this.hotelService.deleteHotel(hotelId, token);
        this.loadHotels();
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }
}
