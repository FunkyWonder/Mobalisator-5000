import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


export interface ApiDialogData {
  title: string;
  subtitle: string;
  apiName: string;
  apiNameHint: string
  apiUrl: string;
  apiUrlHint: string;
  accept: string;
  decline: string;
}

@Component({
  selector: 'api-dialog',
  templateUrl: 'api-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class ApiDialog {
  constructor(
    public dialogRef: MatDialogRef<ApiDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ApiDialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}