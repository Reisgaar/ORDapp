import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface popUpNumberInputData {
  titleRoute: string;
  messageRoute: string;
  popUpLabelRoute: string;
}

@Component({
  selector: 'app-pop-up-number-input',
  templateUrl: './pop-up-number-input.component.html',
  styleUrls: ['./pop-up-number-input.component.scss']
})
export class PopUpNumberInputComponent {
  formError: boolean = false;
  newPrice: string = '0';

  constructor(
    public dialogRef: MatDialogRef<PopUpNumberInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: popUpNumberInputData
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
  confirmationSend(): void {
    this.dialogRef.close(this.newPrice);
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    // If not number prevent default
    if (isNaN(parseInt(event.key, 0))) {
      event.preventDefault();
    }
    // If , or . write . only once
    if ((event.key === ',' || event.key === '.') && !event.target.value.includes('.')) {
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const oldValue = event.target.value;
      event.target.value = oldValue.slice(0, start) + '.' + oldValue.slice(end);
    }
    // Limit to 18 decimals
    if (event.target.value.indexOf('.') >= 0 && event.target.selectionStart > event.target.value.indexOf('.')) {
      event.target.value = event.target.value.slice(0, event.target.value.indexOf('.') + 18);
    }
    // If first enter, remove 0
    if (event.target.value === '0' && !isNaN(parseInt(event.key, 0))) {
      event.target.value = '';
    }
  }
}
