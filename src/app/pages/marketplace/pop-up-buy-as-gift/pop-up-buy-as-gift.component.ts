import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

/**
 * Pop up to buy an NFT as a gift
 */
@Component({
  selector: 'app-pop-up-buy-as-gift',
  templateUrl: './pop-up-buy-as-gift.component.html',
  styleUrls: ['./pop-up-buy-as-gift.component.scss']
})
export class PopUpBuyAsGiftComponent implements OnInit {
  sendTo: string;
  formError = false;

  constructor(
    public dialogRef: MatDialogRef<PopUpBuyAsGiftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
  }

  /**
   * If validation is passed, closes the pop up sending the amount of the bid
   */
  async confirmBuyAsGift(): Promise<void> {
    if (await this.validateForm()) {
      this.dialogRef.close(this.sendTo);
    }
  }

  /**
   * Closes pop up
   */
  async closePopUp(): Promise<void> {
    this.dialogRef.close();
  }

  /**
   * Validates the form
   * @returns {boolean} : true if is valid
   */
  async validateForm(): Promise<boolean> {
    this.formError = false;
    const regex = /^0x[A-z, 0-9]{40}$/;
    if (regex.test(this.sendTo)) {
      const addressIsValid = await this.connectionService.ethers.utils.isAddress(this.sendTo);
      if (addressIsValid) {
        return true;
      } else {
        this.formError = true;
        return false;
      }
    } else {
      this.formError = true;
      return false;
    }
  }
}
