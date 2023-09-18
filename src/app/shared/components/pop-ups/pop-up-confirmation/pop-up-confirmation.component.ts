import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-confirmation',
  templateUrl: './pop-up-confirmation.component.html',
  styleUrls: ['./pop-up-confirmation.component.scss']
})
export class PopUpConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<PopUpConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  confirmationSend(isAccepted: boolean): void {
    this.dialogRef.close(isAccepted);
  }
}
