import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WazclosingComponent } from './wazclosing.component';

describe('WazclosingComponent', () => {
  let component: WazclosingComponent;
  let fixture: ComponentFixture<WazclosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WazclosingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WazclosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
