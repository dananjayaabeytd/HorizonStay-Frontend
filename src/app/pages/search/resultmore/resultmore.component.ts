import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search/search.service'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultmore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultmore.component.html',
})
export class ResultmoreComponent implements OnInit {
  hotel: any;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    const number = this.route.snapshot.paramMap.get('number');
    if (number !== null) {
      this.searchService.currentHotels.subscribe((hotels) => {
        this.hotel = hotels.find((hotel) => hotel.number === +number);
      });
    } else {
      // Handle the case where 'number' is null
      console.error('Number parameter is null');
    }
  }

  // navigateToBooking() {
  //   this.router.navigate(['/makebooking'], { state: { hotel: this.hotel } });
  // }
  navigateToBooking() {
    console.log('Navigating with hotel data:', this.hotel);
    this.router.navigate(['/makebooking'], { state: { hotel: this.hotel } });
  }
}
