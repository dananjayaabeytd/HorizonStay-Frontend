import { TestBed } from '@angular/core/testing';
import { MakebookingComponent } from './makebooking.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('MakebookingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MakebookingComponent, // Import the standalone component here
        HttpClientModule // Import HttpClientModule here
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }) // Mock params or other properties as needed
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MakebookingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});