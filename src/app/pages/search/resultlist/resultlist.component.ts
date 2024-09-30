import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search/search.service'; // Adjust the path as necessary
import { SearchComponent } from '../../landing/search/search.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-resultlist',
  standalone: true,
  imports: [CommonModule,SearchComponent],
  templateUrl: './resultlist.component.html',
})
export class ResultlistComponent {
  hotels: any[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    this.searchService.currentHotels.subscribe(hotels => {
      this.hotels = hotels;
    });
  }

  viewDetails(number: number) {
    this.router.navigate(['/resultmore', number]);
  }
}