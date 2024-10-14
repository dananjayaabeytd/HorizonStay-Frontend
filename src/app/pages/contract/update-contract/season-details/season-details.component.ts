import { Component, HostListener, OnInit } from '@angular/core';
import { DiscountComponent } from "./discount/discount.component";
import { MarkupComponent } from "./markup/markup.component";
import { SupplementComponent } from "./supplement/supplement.component";
import { RoomTypeComponent } from "./room-type/room-type.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-season-details',
  standalone: true,
  imports: [DiscountComponent, MarkupComponent, SupplementComponent, RoomTypeComponent,CommonModule],
  templateUrl: './season-details.component.html'
})
export class SeasonDetailsComponent implements OnInit {
  selectedComponent: string = 'roomtype'; // Default to 'roomtype'
  dropdownVisible: boolean = false;
  hotelID: string | null = null;
  contractID: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hotelID = params['hotelID'];
      this.contractID = params['contractID'];
    });
  }

  selectComponent(component: string) {
    this.selectedComponent = component;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
    const dropdownMenu = document.getElementById('dropdown-season');
    if (dropdownMenu) {
      if (this.dropdownVisible) {
        dropdownMenu.classList.remove('hidden');
      } else {
        dropdownMenu.classList.add('hidden');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdownToggle = document.getElementById('dropdownSeason');
    const dropdownMenu = document.getElementById('dropdown-season');
    if (dropdownToggle && dropdownMenu && !dropdownToggle.contains(event.target as Node) && !dropdownMenu.contains(event.target as Node)) {
      this.dropdownVisible = false;
      dropdownMenu.classList.add('hidden');
    }
  }

    navigateToContracts(hotelID: number) {
      this.router.navigate([`/hotel/contracts/${hotelID}`]);
    }

    navigateToUpdateContractMain(hotelID: number,contractID: number) {  
      this.router.navigate([`/hotel/${hotelID}/update-contract/${contractID}`]);
    }
}