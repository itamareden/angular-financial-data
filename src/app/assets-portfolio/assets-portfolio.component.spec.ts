import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsPortfolioComponent } from './assets-portfolio.component';

describe('AssetsPortfolioComponent', () => {
  let component: AssetsPortfolioComponent;
  let fixture: ComponentFixture<AssetsPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
