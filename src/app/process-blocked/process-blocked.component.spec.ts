import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessBlockedComponent } from './process-blocked.component';

describe('ProcessBlockedComponent', () => {
  let component: ProcessBlockedComponent;
  let fixture: ComponentFixture<ProcessBlockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessBlockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
