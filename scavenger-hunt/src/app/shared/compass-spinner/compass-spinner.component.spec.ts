import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassSpinnerComponent } from './compass-spinner.component';

describe('CompassSpinnerComponent', () => {
  let component: CompassSpinnerComponent;
  let fixture: ComponentFixture<CompassSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompassSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
