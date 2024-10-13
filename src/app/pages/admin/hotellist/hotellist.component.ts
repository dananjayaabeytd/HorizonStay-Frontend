import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../services/hotel/hotel.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';

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
    private alertService: AlertService,
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
    this.router.navigate(['/contract-add', hotelId]);
  }

  navigateToContractList(hotelId: string) {
    this.router.navigate(['hotel/contracts', hotelId]);
  }

  async deleteHotel(hotelId: string) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to delete this Hotel?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );
    
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
