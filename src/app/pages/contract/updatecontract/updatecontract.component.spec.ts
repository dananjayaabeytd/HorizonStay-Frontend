import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecontractComponent } from './updatecontract.component';

describe('UpdatecontractComponent', () => {
  let component: UpdatecontractComponent;
  let fixture: ComponentFixture<UpdatecontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatecontractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
