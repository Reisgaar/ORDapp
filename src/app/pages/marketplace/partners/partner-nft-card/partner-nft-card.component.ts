import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { partners } from 'src/app/constants/partnerships';
import { UtilsService } from 'src/app/shared/services/utils.service';

/**
 * NFT card to show on the partner marketplace list
 */
@Component({
  selector: 'app-partner-nft-card',
  templateUrl: './partner-nft-card.component.html',
  styleUrls: ['./partner-nft-card.component.scss']
})
export class PartnerNftCardComponent implements OnInit, OnDestroy {
  @Input() nft: any;
  @Input() category: string;
  partner: any;
  priceOnBusd: number = 0;
  interval: any;
  auctionEnded: boolean = false;
  profileImage: number;

  constructor(
    private router: Router,
    private utilsService: UtilsService
  ) { }

  /**
   * Get prices on busd and wallet image
   */
  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (bnbPriceOnBusd[0] !== 0 || gqPriceOnBusd[0] !== 0) {
        clearInterval(this.interval);
        this.setPriceOnBusd();
      }
    }, 1000);
    this.partner = partners[this.category];
    if (this.nft.nftSeller) {
      this.profileImage = this.utilsService.getWalletImage(this.nft.nftSeller);
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
   * Sets the price conversion to busd
   */
  async setPriceOnBusd(): Promise<void> {
    if (this.nft.nftOn) {
    if (this.nft.nftOn.toLowerCase() !== 'wallet') {
      const priceToConvert = await this.getPriceToConvert();
      this.priceOnBusd = await this.utilsService.getPriceOnBusd(priceToConvert, this.nft.erc20Token);
    }
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
    this.router.navigate(['/marketplace/partner/nft'], {queryParams: {category: this.category, nftContractAddress: this.nft.nftContractAddress, tokenId: this.nft.tokenId}});
  }

  /**
   * Opens detail of the NFT on a new tab on wheel click
   */
  async wheelToDetail(event: any): Promise<void> {
    event.preventDefault();
    console.log(this.nft);
    if (event.button === 1) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/marketplace/partner/nft'], {queryParams: {category: this.category, nftContractAddress: this.nft.nftContractAddress, tokenId: this.nft.tokenId}})
      );
      window.open(url, '_blank');
    }
  }

}
