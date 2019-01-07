import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodModePageComponent } from './god-mode-page.component';

describe('GodModePageComponent', () => {
  let component: GodModePageComponent;
  let fixture: ComponentFixture<GodModePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodModePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodModePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
