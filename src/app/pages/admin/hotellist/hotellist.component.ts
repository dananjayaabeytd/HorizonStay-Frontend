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
deleteHotel(arg0: any) {
throw new Error('Method not implemented.');
}
navigateToUpdate(arg0: any) {
throw new Error('Method not implemented.');
}
navigateToContractList(arg0: any) {
throw new Error('Method not implemented.');
}
navigateToAddContract(arg0: any) {
throw new Error('Method not implemented.');
}
  hotels: any[] = [];

  constructor(
    private hotelService: HotelService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
  }
}
