import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGameComponent } from './player-game.component';

describe('PlayerGameComponent', () => {
  let component: PlayerGameComponent;
  let fixture: ComponentFixture<PlayerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
