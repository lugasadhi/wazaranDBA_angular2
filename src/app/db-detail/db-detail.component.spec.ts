import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDetailComponent } from './db-detail.component';

describe('DbDetailComponent', () => {
  let component: DbDetailComponent;
  let fixture: ComponentFixture<DbDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
