import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatehotelComponent } from './updatehotel.component';

describe('UpdatehotelComponent', () => {
  let component: UpdatehotelComponent;
  let fixture: ComponentFixture<UpdatehotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatehotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatehotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
