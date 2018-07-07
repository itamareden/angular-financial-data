import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VMarkComponent } from './v-mark.component';

describe('VMarkComponent', () => {
  let component: VMarkComponent;
  let fixture: ComponentFixture<VMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
