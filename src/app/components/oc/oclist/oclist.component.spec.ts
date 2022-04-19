import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OclistComponent } from './oclist.component';

describe('OclistComponent', () => {
  let component: OclistComponent;
  let fixture: ComponentFixture<OclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OclistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
