import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { HeroComponent } from './hero/hero.component';
import { LocationsComponent } from './locations/locations.component';
import { WhyComponent } from './why/why.component';
import { FaqComponent } from './faq/faq.component';
import { SearchComponent } from './search/search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LandingComponent,
        HeroComponent,
        LocationsComponent,
        WhyComponent,
        FaqComponent,
        SearchComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});