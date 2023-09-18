import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-slippage',
  templateUrl: './slippage.component.html',
  styleUrls: ['./slippage.component.scss'],
})
export class SlippageComponent {

  chips: number[] = [0.1, 0.5, 1];
  settings = {
    slipTolerance: Number(localStorage.getItem('slipTolerance')),
    transDeadLine: localStorage.getItem('transDeadLine')
  };

  constructor(
    public dialogRef: MatDialogRef<SlippageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title:string},
  ) {}

  // Set slippage tolerance to selected percentage
  loadSlip(data: number): number{
    return this.settings.slipTolerance = data;
}

// If +100% returns 100
maxCien(): number {
  if (this.settings.slipTolerance >= 100){
    this.settings.slipTolerance = 100;
    return this.settings.slipTolerance;
  }
  return this.settings.slipTolerance;
}

  closePopUp(): void {
    this.dialogRef.close();
  }
}
