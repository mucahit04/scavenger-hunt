import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLocationComponent } from './player-location.component';

describe('PlayerLocationComponent', () => {
  let component: PlayerLocationComponent;
  let fixture: ComponentFixture<PlayerLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
