import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfcanvaComponent } from './pdfcanva.component';

describe('PdfcanvaComponent', () => {
  let component: PdfcanvaComponent;
  let fixture: ComponentFixture<PdfcanvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfcanvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfcanvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
