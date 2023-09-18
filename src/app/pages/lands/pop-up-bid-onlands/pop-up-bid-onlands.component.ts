import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { LandsAuctionService } from 'src/app/shared/services/lands/lands-auction.service';

/**
 * Pop up to manage the bids for the lands
 */
@Component({
  selector: 'app-pop-up-bid-onlands',
  templateUrl: './pop-up-bid-onlands.component.html',
  styleUrls: ['./pop-up-bid-onlands.component.scss']
})
export class PopUpBidOnlandsComponent implements OnInit, OnDestroy {
  minimumBid: string;
  bidAmount: any = '0';
  formError = false;
  lowBidError: boolean = true;
  auctionData: any;
  loadingData: boolean = false;
  refreshDataInterval: any;
  gqPriceOnBusd: any = gqPriceOnBusd;
  actionIsAvailable = false;
  actionAllowTimerInterval: any;

  constructor(
    private connectionService: ConnectionService,
    private landsAuctionService: LandsAuctionService,
    public dialogRef: MatDialogRef<PopUpBidOnlandsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Controls the enter key pushing
   * @param event key pressing event
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if ((event.key.toLowerCase() ===  'enter' && !this.formError && this.bidAmount !== '0') || this.data.type === 'buyout') {
      this.confirmBid();
    }
  }

  /**
   * Inits the data
   */
  ngOnInit(): void {
    console.log(this.data);
    this.initData();
  }

  /**
   * Clear the interval if exist
   */
  ngOnDestroy(): void {
    if (this.refreshDataInterval) {
      clearInterval(this.refreshDataInterval);
    }
  }

  /**
   * Gets auction data from blockchain and updates it every 10 seconds
   */
  async initData(): Promise<any> {
    this.loadingData = true;
    await this.checkIfWalletConnected();
    await this.getBCData();
    this.refreshDataInterval = setInterval( async () => {
      await this.getBCData();
    }, 4000);
  }

  /**
   * Checks if wallet is connected, if not, closes pop up and opens metamask
   * @returns user's wallet
   */
  async checkIfWalletConnected(): Promise<any> {
    try {
      const userAddr = this.connectionService.getWalletAddress();
      return userAddr;
    } catch (error: any) {
      this.closePopUp();
      document.getElementById('connect-wallet')?.click();
    }

  }

  /**
   * Gets auction data from blockchain
   */
  async getBCData(): Promise<any> {
    const oldData = this.auctionData;
    try {
      this.auctionData = await this.landsAuctionService.getLandAuctionData(this.data.nft.counter, this.data.nft.auctionContract);
      console.log('Auction BlockChain data');
      console.log(this.auctionData);
      await this.setMinimumBid();
      if (this.data.type === 'buyout') { await this.setBuyoutTimer(); }
      if (this.data.type === 'bid') { await this.setBidTimer(); }
    } catch (error: any) {
      this.auctionData = oldData;
    }
  }

  /**
   * Sets the timer to control buyout availability
   */
  async setBuyoutTimer(): Promise<any> {
    this.actionAllowTimerInterval = setInterval( async (): Promise<any> => {
      const now = Math.ceil(Date.now() / 1000);
      const buyoutStart = parseInt(this.auctionData.buyoutStartTimeStamp, 0);
      if (buyoutStart < now || buyoutStart === 0) {
        this.actionIsAvailable = true;
      } else {
        this.actionIsAvailable = false;
      }
      this.loadingData = false;
    }, 1000);
  }

  /**
   * Sets the timer to control bid availability
   */
  async setBidTimer(): Promise<any> {
    this.actionAllowTimerInterval = setInterval( async (): Promise<any> => {
      const now = Math.ceil(Date.now() / 1000);
      const bidStart = parseInt(this.auctionData.nextBidStartTimeStamp, 0);
      if (bidStart < now || bidStart === 0) {
        this.actionIsAvailable = true;
      } else {
        this.actionIsAvailable = false;
      }
      this.loadingData = false;
    }, 1000);
  }

  /**
   * Sets the value of the minimum bid
   */
  async setMinimumBid(): Promise<any> {
    if (this.auctionData.highestBid.toString() === '0') {
      this.minimumBid = this.connectionService.fromWei(this.auctionData.startPrice);
    } else {
      const lastBid = this.connectionService.fromWei(this.auctionData.highestBid);
      const percentIncrease = parseInt(this.auctionData.bidIncreasePercentageInBP, 0) / 100;
      const increment = (parseInt(lastBid, 0) * percentIncrease) / 100;
      const nextBid = parseFloat(lastBid) + increment;
      // Rounded to 4 decimals to avoid error on bids
      const roundedNextBid = Math.ceil(nextBid * 10000) / 10000;
      this.minimumBid = roundedNextBid.toString();
      console.log('minBid:', this.minimumBid);
    }
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

  /**
   * If form is valid, closes the pop up sending the amount data
   */
  async confirmBid(): Promise<void> {
    if (this.data.type === 'buyout') {
      this.bidAmount = this.auctionData.actualBuyout;
      this.dialogRef.close(this.bidAmount);
    } else if (await this.validateForm()) {
      this.dialogRef.close(this.bidAmount);
    }
  }

  /**
   * Closes the pop up
   */
  async closePopUp(): Promise<void> {
    this.dialogRef.close();
  }

  /**
   * Validates the form
   * @returns true if is valid
   */
  async validateForm(): Promise<any> {
    this.formError = false;
    // Transform to wei to avoid decimals and to BN to make comparison
    const bidBN = await this.connectionService.ethers.utils.parseUnits(this.bidAmount, "ether");
    const minBidBN = await this.connectionService.ethers.utils.parseUnits(this.minimumBid, "ether");
    const maxBidBN = await this.connectionService.ethers.utils.parseUnits(this.auctionData.actualBuyout, "wei");
    const isBiggerThanMin = bidBN.gte(minBidBN);
    const isLowerThanBuy = bidBN.lt(maxBidBN);
    console.log(isLowerThanBuy);
    if (!isBiggerThanMin) {
      this.formError = true;
      this.lowBidError = true;
      return false;
    } else if (!isLowerThanBuy) {
      this.formError = true;
      this.lowBidError = false;
      return false;
    } else {
      return true;
    }
  }

}
