import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocheckallbranchComponent } from './autocheckallbranch.component';

describe('AutocheckallbranchComponent', () => {
  let component: AutocheckallbranchComponent;
  let fixture: ComponentFixture<AutocheckallbranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocheckallbranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocheckallbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
