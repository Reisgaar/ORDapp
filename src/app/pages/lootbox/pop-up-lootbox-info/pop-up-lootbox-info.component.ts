import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { LootboxService } from 'src/app/shared/services/lootboxes/lootbox.service';

/**
 * Pop up with info of the lootbox (multiple usages)
 */
@Component({
  selector: 'app-pop-up-lootbox-info',
  templateUrl: './pop-up-lootbox-info.component.html',
  styleUrls: ['./pop-up-lootbox-info.component.scss']
})
export class PopUpLootboxInfoComponent implements OnInit, OnDestroy {

  roundedPrice = 0;
  currency = ['BUSD', 'SCK'];
  texts = [
    'lootbox.popUp.approveBusd',
    'lootbox.popUp.approveSck',
    'lootbox.popUp.currentPrice',
    'lootbox.popUp.connectWallet',
    'lootbox.popUp.startBuy',
    'lootbox.popUp.error',
    'lootbox.popUp.confirmTransaction'
  ];
  slippage = 1;
  interval: any;

  constructor(
    public dialogRef: MatDialogRef<PopUpLootboxInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private connectionService: ConnectionService,
    private lootboxService: LootboxService
  ) {
  }

  /**
   * Get lootbox price
   */
  ngOnInit(): void {
    if (this.data.price) {
      console.log(this.data.price);
      const price = this.connectionService.fromWei(this.data.price);
      this.roundedPrice = (Math.ceil(parseFloat(price) * 10000)) / 10000;
      if (this.data.text === 2) {
        if (this.data.tier !== 0 && this.data.tier !== '0'){
          this.interval = setInterval(async () => {
            let price = await this.lootboxService.getLootboxPrice(this.data.tier, this.data.paymentCoin);
            price = this.connectionService.fromWei(price);
            this.roundedPrice = (Math.ceil(parseFloat(price) * 10000)) / 10000;
            console.log(this.roundedPrice)
          }, 3000);
        }
      }
    }
  }

  /**
   * Clears interval
   */
  ngOnDestroy(): void {
    if (this.data.text === 2) {
      clearInterval(this.interval);
    }
  }

  /**
   * Set text to shown dependig tier
   * @param {string} text : text to show
   * @returns {string} new text to show
   */
  setTierOnText2(text: string): string {
    let newText = text;
    if (this.data.tier === 0 || this.data.tier === '0') {
      newText = newText.replace('Tier *** lootbox', 'Mystery Box');
      newText = newText.replace('lootbox de Tier ***', 'Mystery Box');
    } else if (this.data.tier === 6 || this.data.tier === '6') {
      newText = newText.replace('Tier ***', 'Clan');
    } else {
      newText = newText.replace('***', this.data.tier);
    }
    return newText;
  }

  /**
   * Closes pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Set the slippage percentage
   * @param {number} percentage : The slippage percentage
   */
  setRange(percentage: number): void {
    const range = document.getElementById('slip-range') as HTMLInputElement;
    range.value = percentage.toString();
    this.slippage = percentage;
  }

  /**
   * Confirm lootbox buy
   */
  async confirmBuy(): Promise<void> {
    let price = await this.lootboxService.getLootboxPrice(this.data.tier, this.data.paymentCoin);
    price = this.connectionService.fromWei(price);
    price = parseFloat(price);
    const maxAmount = price + (price * (this.slippage / 100));
    this.dialogRef.close(maxAmount);
  }

  /**
   * Confirm mistery box buy
   */
  async confirmBuyMistery(): Promise<void> {
    this.dialogRef.close(true);
  }

}
