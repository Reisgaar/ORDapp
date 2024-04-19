import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-get-nfts',
  templateUrl: './pop-up-get-nfts.component.html',
  styleUrls: ['./pop-up-get-nfts.component.scss']
})
export class PopUpGetNftsComponent {
  constructor(
    public dialogRef: MatDialogRef<PopUpGetNftsComponent>
  ) { }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
