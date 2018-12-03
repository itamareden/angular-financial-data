import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokenLineComponent } from './broken-line.component';

describe('BrokenLineComponent', () => {
  let component: BrokenLineComponent;
  let fixture: ComponentFixture<BrokenLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokenLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokenLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
