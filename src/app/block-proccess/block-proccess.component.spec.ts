import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProccessComponent } from './block-proccess.component';

describe('BlockProccessComponent', () => {
  let component: BlockProccessComponent;
  let fixture: ComponentFixture<BlockProccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockProccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
