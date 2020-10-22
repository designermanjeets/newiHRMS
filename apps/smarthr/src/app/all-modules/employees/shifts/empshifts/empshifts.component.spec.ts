import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpshiftsComponent } from './empshifts.component';

describe('EmpshiftsComponent', () => {
  let component: EmpshiftsComponent;
  let fixture: ComponentFixture<EmpshiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpshiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
