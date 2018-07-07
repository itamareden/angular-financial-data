import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTriangleComponent } from './open-triangle.component';

describe('OpenTriangleComponent', () => {
  let component: OpenTriangleComponent;
  let fixture: ComponentFixture<OpenTriangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenTriangleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTriangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
