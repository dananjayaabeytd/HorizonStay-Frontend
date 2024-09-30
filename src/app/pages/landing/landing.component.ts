import { Component } from '@angular/core';
import { HeroComponent } from "./hero/hero.component";
import { LocationsComponent } from "./locations/locations.component";
import { WhyComponent } from "./why/why.component";
import { FaqComponent } from "./faq/faq.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, LocationsComponent, WhyComponent, FaqComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {

}
