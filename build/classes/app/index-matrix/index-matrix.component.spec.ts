import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMatrixComponent } from './index-matrix.component';

describe('IndexMatrixComponent', () => {
  let component: IndexMatrixComponent;
  let fixture: ComponentFixture<IndexMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
