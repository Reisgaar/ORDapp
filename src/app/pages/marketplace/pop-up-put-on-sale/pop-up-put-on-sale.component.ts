import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Pop up to put on sale an NFT
 */
@Component({
  selector: 'app-pop-up-put-on-sale',
  templateUrl: './pop-up-put-on-sale.component.html',
  styleUrls: ['./pop-up-put-on-sale.component.scss']
})
export class PopUpPutOnSaleComponent implements OnInit {
  amount = 0;
  selectedCurrency = 'Currency';
  formError = false;
  auctionTime = 172800;
  isCustomAuction = false;
  bidPercentage = 1;

  constructor(
    public dialogRef: MatDialogRef<PopUpPutOnSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  /**
   * Prevents the erase on the input
   * @param {any} event : key press event
   */
  preventErase(event: any): void {
    if (event.keyCode === 46) {
      event.preventDefault();
    }
  }

  /**
   * If validation is passed, closes the pop up sending the amount of the bid
   */
  async confirmPutOnSale(): Promise<void> {
    if (this.validateForm()) {
      this.dialogRef.close({amount: this.amount, token: this.selectedCurrency, auctionTime: this.auctionTime, bidPercentage: (this.bidPercentage * 100)});
    }
  }

  /**
   * Closes pop up
   */
  async closePopUp(): Promise<void> {
    this.dialogRef.close();
  }

  /**
   * Changes the selected currency
   * @param {string} newCurrency : currency to change to
   */
  changeSelectedCurrencyTo(newCurrency: string): void {
    this.selectedCurrency = newCurrency;
  }

  /**
   * Validates the form
   * @returns {boolean} : true if is valid
   */
  validateForm(): boolean {
    this.formError = false;
    if ((this.data.type === 'putSale' || this.data.type === 'putAuction') && this.selectedCurrency !== 'Currency' && this.amount > 0) {
      return true;
    } else if (this.data.type === 'change' && this.amount > 0) {
      return true;
    } else {
      this.formError = true;
      return false;
    }
  }

  /**
   * Resets the bid to default values
   */
  resetCustomBid(): void {
    this.auctionTime = 172800;
    this.bidPercentage = 1;
  }

  /**
   * Fits bid percent to stablished limits >1 & <50
   */
  fitBidPercentToLimits(): void {
    if (this.bidPercentage < 1) {
      this.bidPercentage = 1;
    } else if (this.bidPercentage > 50) {
      this.bidPercentage = 50;
    }
  }

}
