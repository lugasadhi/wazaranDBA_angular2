import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinerComponent } from './spiner.component';

describe('SpinerComponent', () => {
  let component: SpinerComponent;
  let fixture: ComponentFixture<SpinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
