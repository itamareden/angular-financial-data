import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsMenuModalComponent } from './assets-menu-modal.component';

describe('AssetsMenuModalComponent', () => {
  let component: AssetsMenuModalComponent;
  let fixture: ComponentFixture<AssetsMenuModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsMenuModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
