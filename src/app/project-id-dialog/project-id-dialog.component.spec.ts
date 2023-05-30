import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIdDialogComponent } from './project-id-dialog.component';

describe('ProjectIdDialogComponent', () => {
  let component: ProjectIdDialogComponent;
  let fixture: ComponentFixture<ProjectIdDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectIdDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectIdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
