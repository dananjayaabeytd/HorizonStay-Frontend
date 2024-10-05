import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementComponent } from './supplement.component';

describe('SupplementComponent', () => {
  let component: SupplementComponent;
  let fixture: ComponentFixture<SupplementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
