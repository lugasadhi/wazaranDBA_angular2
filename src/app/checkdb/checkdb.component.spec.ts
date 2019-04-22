import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckdbComponent } from './checkdb.component';

describe('CheckdbComponent', () => {
  let component: CheckdbComponent;
  let fixture: ComponentFixture<CheckdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
