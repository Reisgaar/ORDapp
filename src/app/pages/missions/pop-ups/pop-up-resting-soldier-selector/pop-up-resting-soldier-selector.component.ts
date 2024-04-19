import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-resting-soldier-selector',
  templateUrl: './pop-up-resting-soldier-selector.component.html',
  styleUrls: ['./pop-up-resting-soldier-selector.component.scss']
})
export class PopUpRestingSoldierSelectorComponent {

  constructor(
    public dialogRef: MatDialogRef<PopUpRestingSoldierSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  selectNft(soldierId: number): void {
    this.dialogRef.close(soldierId);
  }

}
