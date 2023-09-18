import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { UtilsService } from 'src/app/shared/services/utils.service';

/**
 * Card to show the NFTs on the marketplace
 */
@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss']
})
export class NftCardComponent implements OnInit, OnDestroy {
  @Input() nft: any;
  priceOnBusd: number = 0;
  interval: any;
  holdtelKeyAddress = contractAddresses.holdtelKey;
  clanBadgeAddress = contractAddresses.clanBadge;
  exocreditAddress = contractAddresses.exocredit;
  landAddress = contractAddresses.land;
  auctionEnded: boolean = false;
  exoAmount: number;

  constructor(
    private router: Router,
    private utilsService: UtilsService
  ) { }

  /**
   * Get prices on busd, profile image and exo amount
   */
  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (bnbPriceOnBusd[0] !== 0 || gqPriceOnBusd[0] !== 0) {
        clearInterval(this.interval);
        this.setPriceOnBusd();
      }
    }, 1000);
    if (this.nft.name.toLowerCase() === 'exocredit') {
      this.setExoAmount();
    }
  }

  /**
   * Clears interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Receive data from child to know if auction is ended
   * @param {any} $event : event emited from child
   */
  receiveData($event: any): void {
    this.auctionEnded = $event;
  }

  /**
   * If the NFT is of exocredit, sets the amount
   */
  setExoAmount(): void {
    const aaa = this.nft.attributes.find( (item: any) => item.trait_type.toLowerCase() === 'value');
    this.exoAmount = aaa.value;
  }

  /**
   * Sets the price conversion to busd
   */
  async setPriceOnBusd(): Promise<void> {
    if (this.nft.nftOn.toLowerCase() !== 'wallet') {
      const priceToConvert = await this.getPriceToConvert();
      this.priceOnBusd = await this.utilsService.getPriceOnBusd(priceToConvert, this.nft.erc20Token);
    }
  }

  /**
   * Gets the required price to convert
   * @returns : the price to convert
   */
  async getPriceToConvert(): Promise<any> {
    let price = 0;
    if (this.nft.buyPrice) {
      price = this.nft.buyPrice;
    } else if (this.nft.bidsMade === '0') {
      price = this.nft.minPrice;
    } else if (this.nft.bidsMade !== '0') {
      price = this.nft.nftHighestBid;
    }
    return price;
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
    this.router.navigate(['/marketplace/nft'], {queryParams: {nftContractAddress: this.nft.nftContractAddress, id: this.nft.tokenId}});
  }

  /**
   * Opens detail of the NFT on a new tab on wheel click
   */
  async wheelToDetail(event: any): Promise<void> {
    event.preventDefault();
    console.log(this.nft);
    if (event.button === 1) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: this.nft.nftContractAddress, id: this.nft.tokenId}})
      );
      window.open(url, '_blank');
    }
  }

}
