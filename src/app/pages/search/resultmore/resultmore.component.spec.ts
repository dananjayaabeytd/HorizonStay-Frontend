import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultmoreComponent } from './resultmore.component';

describe('ResultmoreComponent', () => {
  let component: ResultmoreComponent;
  let fixture: ComponentFixture<ResultmoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultmoreComponent]
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
