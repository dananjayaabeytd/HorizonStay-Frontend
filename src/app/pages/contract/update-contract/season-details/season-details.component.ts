import { Component } from '@angular/core';
import { DiscountComponent } from "./discount/discount.component";
import { MarkupComponent } from "./markup/markup.component";
import { SupplementComponent } from "./supplement/supplement.component";
import { RoomTypeComponent } from "./room-type/room-type.component";

@Component({
  selector: 'app-season-details',
  standalone: true,
  imports: [DiscountComponent, MarkupComponent, SupplementComponent, RoomTypeComponent],
  templateUrl: './season-details.component.html'
})
export class SeasonDetailsComponent {

}
