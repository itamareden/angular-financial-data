import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriangleIconComponent } from './triangle-icon.component';

describe('TriangleIconComponent', () => {
  let component: TriangleIconComponent;
  let fixture: ComponentFixture<TriangleIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriangleIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriangleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
