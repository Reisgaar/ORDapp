import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

/**
 * Pop up to put on sale a partner NFT
 */
@Component({
  selector: 'app-partner-pop-up-put-on-sale',
  templateUrl: './partner-pop-up-put-on-sale.component.html',
  styleUrls: ['./partner-pop-up-put-on-sale.component.scss']
})
export class PartnerPopUpPutOnSaleComponent implements OnInit {
  amount = 0;
  selectedCurrency = 'Currency';
  formError = false;
  sendToError = false;
  extraFeeError = false;
  auctionTime = 172800;
  isCustomAuction = false;
  isCustomSale = false;
  bidPercentage = 1;
  extraFeePercentage = 0;
  sendFeeTo: string = '';

  constructor(
    private connectionService: ConnectionService,
    public dialogRef: MatDialogRef<PartnerPopUpPutOnSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.saleData.nftSeller !== '0x0000000000000000000000000000000000000000') {
      this.setPreviousData(this.data.saleData);
    }
  }

  /**
   * Sets the previous data of the sale
   * @param saleData : sale data of the NFT
   */
  async setPreviousData(saleData: any): Promise<any> {
    this.amount = parseFloat(this.connectionService.fromWei(saleData.buyPrice));
    if (saleData.userfeePercentage !== '0') {
      this.isCustomSale = true;
      this.extraFeePercentage = parseInt(saleData.userFeePercentage, 0) / 100;
      this.sendFeeTo = saleData.userFeeRecipient;
    }
  }

  /**
   * Prevents erase on input
   * @param {any} event : click event
   */
  preventErase(event: any): void {
    if (event.keyCode === 46) {
      event.preventDefault();
    }
  }

  /**
   * If form is valid, closes the pop up sending the data of the sale
   */
  async confirmPutOnSale(): Promise<void> {
    if (await this.validateForm()) {
      this.dialogRef.close({
        amount: this.amount,
        token: this.selectedCurrency,
        auctionTime: this.auctionTime,
        bidPercentage: (this.bidPercentage * 100),
        extraFeePercentage: (this.extraFeePercentage * 100),
        sendFeeTo: this.sendFeeTo
      });
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
  async validateForm(): Promise<boolean> {
    const priceIsValid = this.checkPrice();
    let extraFeeIsValid = true;
    let sendToIsValid = true;
    if (this.isCustomSale) {
      extraFeeIsValid = this.checkExtraFee();
      sendToIsValid = await this.checkWallet();
    }
    if (priceIsValid && sendToIsValid && extraFeeIsValid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the price is valid
   * @returns {boolean} : true if price is correct
   */
  checkPrice(): boolean {
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
   * Checks if extra fee is valid
   * @returns {boolean} : true if price is correct
   */
  checkExtraFee(): boolean {
    this.extraFeeError = false;
    if (this.extraFeePercentage >= 0 && this.extraFeePercentage <= 96) {
      return true;
    } else {
      this.extraFeeError = true;
      return false;
    }
  }

  /**
   * Checks if wallet to send to is valid
   * @returns {boolean} : true if wallet is correct
   */
  async checkWallet(): Promise<boolean> {
    this.sendToError = false;
    const regex = /^0x[A-z, 0-9]{40}$/;
    if (regex.test(this.sendFeeTo)) {
      const addressIsValid = await this.connectionService.ethers.utils.isAddress(this.sendFeeTo);
      if (addressIsValid) {
        return true;
      } else {
        this.sendToError = true;
        return false;
      }
    } else {
      this.sendToError = true;
      return false;
    }
  }

  /**
   * Resets to the custom bid
   */
  resetCustomBid(): void {
    this.auctionTime = 172800;
    this.bidPercentage = 1;
  }

  /**
   * Resets to the custom sale
   */
  resetCustomSale(): void {
    this.sendFeeTo = '';
    this.extraFeePercentage = 0;
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

  /**
   * Fits extra fee percent to stablished limits >0 & <96
   */
  fitExtraFeePercentToLimits(): void {
    if (this.extraFeePercentage < 0) {
      this.extraFeePercentage = 0;
    } else if (this.extraFeePercentage > 96) {
      this.extraFeePercentage = 96;
    }
  }

}
