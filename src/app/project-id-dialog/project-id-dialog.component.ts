import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ProjectIdDialogData {
  title: string;
  subtitle: string;
  projectId: number;
  accept: string;
}

@Component({
  selector: 'app-project-id-dialog',
  templateUrl: './project-id-dialog.component.html',
  styleUrls: ['./project-id-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class ProjectIdDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProjectIdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectIdDialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}