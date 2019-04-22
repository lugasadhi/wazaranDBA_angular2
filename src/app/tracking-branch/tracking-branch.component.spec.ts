import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingBranchComponent } from './tracking-branch.component';

describe('TrackingBranchComponent', () => {
  let component: TrackingBranchComponent;
  let fixture: ComponentFixture<TrackingBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
