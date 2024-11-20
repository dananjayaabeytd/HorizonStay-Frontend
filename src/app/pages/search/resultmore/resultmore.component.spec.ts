import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';

import { ResultmoreComponent } from './resultmore.component';
import { SearchService } from '../../../services/search/search.service';

describe('ResultmoreComponent', () => {
  let component: ResultmoreComponent;
  let fixture: ComponentFixture<ResultmoreComponent>;
  let searchServiceStub: Partial<SearchService>;

  beforeEach(async () => {
    searchServiceStub = {
      currentHotels: of([{ number: 123, name: 'Test Hotel' }])
    };

    await TestBed.configureTestingModule({
      imports: [ResultmoreComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ number: '123' })
            }
          }
        },
        { provide: SearchService, useValue: searchServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});