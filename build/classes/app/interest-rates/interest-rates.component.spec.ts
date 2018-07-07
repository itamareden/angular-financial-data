import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestRatesComponent } from './interest-rates.component';

describe('InterestRatesComponent', () => {
  let component: InterestRatesComponent;
  let fixture: ComponentFixture<InterestRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
