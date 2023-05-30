import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDialogComponent } from './api-dialog.component';

describe('ApiDialogComponent', () => {
  let component: ApiDialogComponent;
  let fixture: ComponentFixture<ApiDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiDialogComponent]
    });
    fixture = TestBed.createComponent(ApiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
