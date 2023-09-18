import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Pop up to bid on an auctioned NFT
 */
@Component({
  selector: 'app-pop-up-bid-on-auction',
  templateUrl: './pop-up-bid-on-auction.component.html',
  styleUrls: ['./pop-up-bid-on-auction.component.scss']
})
export class PopUpBidOnAuctionComponent implements OnInit {
  minimumBid: string;
  bidAmount: string;
  formError = false;

  constructor(
    public dialogRef: MatDialogRef<PopUpBidOnAuctionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Sets the minimum bid and the bid amount
   */
  ngOnInit(): void {
    console.log(this.data);
    if (this.data.actualPrice === '0') {
      this.minimumBid = this.data.initialPrice;
      this.bidAmount = this.data.initialPrice;
    } else {
      this.minimumBid = this.data.minBid;
      this.bidAmount = this.data.minBid;
    }
  }

  /**
   * If validation is passed, closes the pop up sending the amount of the bid
   */
  async confirmBid(): Promise<void> {
    if (this.validateForm()) {
      this.dialogRef.close(this.bidAmount);
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
  validateForm(): boolean {
    this.formError = false;
    if (parseFloat(this.bidAmount) < parseFloat(this.data.actualPrice)) {
      this.formError = true;
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if bid amount is higher than minimum bid, if not, shows error
   */
  checkIfIsMinValue(): void {
    this.formError = false;
    if (parseFloat(this.bidAmount) < parseFloat(this.minimumBid)) {
      this.formError = true;
    }
  }

}
