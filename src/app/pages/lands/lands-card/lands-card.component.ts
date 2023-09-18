import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { LandsAuctionService } from 'src/app/shared/services/lands/lands-auction.service';
import { PopUpBidOnlandsComponent } from '../pop-up-bid-onlands/pop-up-bid-onlands.component';
import { contractAddresses } from 'src/app/constants/contractAddresses';

/**
 * Card to show on lands bid list
 */
@Component({
  selector: 'app-lands-card',
  templateUrl: './lands-card.component.html',
  styleUrls: ['./lands-card.component.scss']
})
export class LandsCardComponent implements OnInit {
  @Input() display: string;
  @Input() nft: any;
  @Input() whitelist: any;
  gqPriceOnBusd = gqPriceOnBusd;
  actualBuyout: string = '0';
  auctionEnded: boolean = false;
  auctionStarted: boolean = false;
  showActualBuyout: boolean = false;
  buyoutEnabled: boolean = false;
  buyoutTimerInterval: any;
  userAddress: string = '';
  tooltipX: number = 0;
  tooltipY: number = 0;

  constructor(
    private connectionService: ConnectionService,
    private landsAuctionService: LandsAuctionService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  /**
   * Sets the buyout and gets user wallet
   */
  ngOnInit(): void {
    this.setBuyoutAmount();
    this.setBuyoutTimer();
    this.buyoutTimerInterval = setInterval( async () => {
      try {
        this.userAddress = this.connectionService.getWalletAddress();
        clearInterval(this.buyoutTimerInterval);
      } catch (error: any) { }
    }, 1000);
  }

  /**
   * Receives data from countdown child
   * @param $event event emited by child component
   */
  receiveData($event: any): void {
    const now = Math.ceil(Date.now() / 1000);
    const end = parseInt(this.nft.endTimeStamp, 0);
    const start = parseInt(this.nft.startTimeStamp, 0);
    if (now < start && now < end) {
      this.auctionStarted = false;
      this.auctionEnded = false;
    } else if (now >= start && now < end) {
      this.auctionStarted = true;
      this.auctionEnded = false;
    } else {
      this.auctionStarted = true;
      this.auctionEnded = true;
    }
  }

  /**
   * Sets the buyout price working with Big Numbers
   */
  async setBuyoutAmount(): Promise<any> {
    const highestBidBN = await this.connectionService.ethers.utils.parseUnits(this.nft.nftHighestBid, "wei");
    const buyoutPercentageBN = await this.connectionService.ethers.utils.parseUnits(this.nft.buyOutPercentageInBP, "ether");
    const totalPercentageBN = await this.connectionService.ethers.utils.parseUnits('10000', "ether");
    const incrementBN = await highestBidBN.mul(buyoutPercentageBN).div(totalPercentageBN);
    const actualBuyoutBN = await highestBidBN.add(incrementBN);
    this.actualBuyout = await actualBuyoutBN.toString();
    const minBuyoutBN = await this.connectionService.ethers.utils.parseUnits(this.nft.minBuyOutPrice, "wei");
    this.showActualBuyout = await actualBuyoutBN.gte(minBuyoutBN);
  }

  /**
   * Sets the timer to control buyout availability
   */
  setBuyoutTimer(): void {
    try {
      this.buyoutTimerInterval = setInterval( async () => {
        const now = Math.ceil(Date.now() / 1000);
        if (this.nft.buyOutStartTime) {
          const buyoutStart = parseInt(this.nft.buyOutStartTime, 0);
          if (buyoutStart < now) {
            this.buyoutEnabled = true;
          } else {
            this.buyoutEnabled = false;
          }
        } else {
          this.buyoutEnabled = true;
        }
      }, 1000);
    } catch (error: any) {
      this.buyoutEnabled = true;
    }
  }

  /**
   * Makes bid or buyout in a land auction
   * @param type can be 'bid' or 'buyout'
   * @param isBuyout true if is buyout
   */
  async bidOrBuyLandAuction(type: string, isBuyout: boolean): Promise<any> {
    this.openBidOnLandAuction(type, this.nft).afterClosed().subscribe( async (amount: any) => {
      console.log(amount);
      if (amount) {
        if (type === 'bid') {
          amount = this.connectionService.toWei(amount);
        }
        const itemName = await this.nft.size + ' Land';
        const nftContractAddress = this.whitelist.nftContractAddress;
        const tokenId = this.whitelist.tokenId;
        await this.landsAuctionService.landBidOrBuy(isBuyout, this.nft, amount, nftContractAddress, tokenId, itemName).then( (res: any) => {
          console.log(res);
        });
      }
    });
  }

  /**
   * Withdraws a land when auction is finished
   */
  async withdrawAuction(): Promise<any> {
    await this.landsAuctionService.withdrawAuction(parseInt(this.nft.counter, 0), this.nft);
  }

  /**
   * Opens a pop up to input the amount to bid
   * @param type can be 'bid' or 'buyout'
   * @param nft the land nft
   * @returns the dialog
   */
  openBidOnLandAuction(type: string, nft: any): any  {
    return this.dialog.open(PopUpBidOnlandsComponent, {
      panelClass: 'sale-dialog-container',
      data: { type, nft }
    });
  }

  /**
   * Controls the mouse position to show te tooltip next to the cursor
   * @param event mouse event
   */
  tooltipPosition(event: any): void {
    this.tooltipX = event.layerX + 10;
    this.tooltipY = event.layerY + 15;
  }

  /**
   * Prevents scroll on mousedown
   * @param {any} event : event of mousedown
   */
  preventScroll(event: any): void {
    if (event.button === 1) {
      event.preventDefault();
    }
  }

  /**
   * Opens detail of the NFT on click
   */
  async clickToDetail(): Promise<void> {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: contractAddresses.land, id: this.nft.tokenId}})
    );
    window.open(url, '_blank');
  }

  /**
   * Opens detail of the NFT on a new tab on wheel click
   */
  async wheelToDetail(event: any): Promise<void> {
    event.preventDefault();
    console.log(this.nft);
    if (event.button === 1) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: contractAddresses.land, id: this.nft.tokenId}})
      );
      window.open(url, '_blank');
    }
  }

}
