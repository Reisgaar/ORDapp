import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getPartnersNftTransferData } from 'src/app/constants/gqlQueries';
import { activeUser } from 'src/app/constants/inventory';
import { partners } from 'src/app/constants/partnerships';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { PartnerEnglishAuctionService } from 'src/app/shared/services/partnership/partner-english-auction.service';
import { PartnerNftService } from 'src/app/shared/services/partnership/partner-nft.service';
import { PartnerSellService } from 'src/app/shared/services/partnership/partner-sell.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { OracleApiService } from 'src/app/shared/services/oracle-api.service';
import { PartnerApiService } from 'src/app/shared/services/partner-api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { PopUpBidOnAuctionComponent } from '../../pop-up-bid-on-auction/pop-up-bid-on-auction.component';
import { PopUpBuyAsGiftComponent } from '../../pop-up-buy-as-gift/pop-up-buy-as-gift.component';
import { PartnerPopUpBurnToReceiveComponent } from '../partner-pop-up-burn-to-receive/partner-pop-up-burn-to-receive.component';
import { PartnerPopUpPutOnSaleComponent } from '../partner-pop-up-put-on-sale/partner-pop-up-put-on-sale.component';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';

/**
 * Detail page for the NFT
 */
@Component({
  selector: 'app-partner-nft',
  templateUrl: './partner-nft.component.html',
  styleUrls: ['./partner-nft.component.scss']
})
export class PartnerNftComponent implements OnInit, OnDestroy {
  nft: any;
  category: string;
  tokenId: string;
  nftContractAddress: string;
  partner: any;
  profileImage: number = -1;

  tokenType: string;
  nftData: any;
  nftSaleData: any;
  buyPrice = '0';
  buyPriceWei = '';
  nextBidPrice: number;
  buyCoin = '';
  loadingData: boolean = true;
  priceInBUSD = 0;
  activeUser = activeUser;
  saleType: string = 'none';
  initialPrice: any;
  auctionEnded: boolean = false;
  interval: any;
  zeroAddress: string = '0x0000000000000000000000000000000000000000';
  querySubscription: any;
  nftTransfers: Array<any> = [];
  nftIsRedeemable: boolean = false;
  playVideoInterval: any;

  // Booleans to show/hide panels
  showPriceHistory: boolean = true;
  showAbout: boolean = true;
  showAttributes: boolean = true;
  showHistory: boolean = true;
  showMetadata: boolean = true;
  allowedNFTs: Array<string> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private oracleApiService: OracleApiService,
    private partnerNftService: PartnerNftService,
    private partnerSellService: PartnerSellService,
    private partnerEnglishAuctionService: PartnerEnglishAuctionService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private apollo: Apollo
  ) {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      this.category = params.category;
      this.tokenId = params.tokenId;
      this.nftContractAddress = params.nftContractAddress;
    });
    this.partner = partners[this.category];
    try {
      if (this.partner.burneable) {
      this.partner.burneable = this.partner.burneable.map( (i: any) => i.toLowerCase() );
      }
      if (this.partner.redeemable) {
        this.partner.redeemable = this.partner.redeemable.map( (i: any) => i.toLowerCase() );
      }
    } catch (error: any) { }
    if (!this.partner) { this.partner = partners['noPartner']; }
    this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
    console.log(this.partner);
    this.setAllowedNFTs();
  }

  /**
   * Set interval to get Price data and refresh each 10 seconds
   */
  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.getNftPriceData();
      this.checkRedeemability();
    }, 10000);
    this.getTransfersData();
    this.playVideo();
  }

  /**
   * Clears interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Receive data from child to know if auction is ended
   * @param {any} $event : event emited from child
   */
  receiveData($event: any): void {
    this.auctionEnded = $event;
  }

  /**
   * Read de DOM until gets video, set to muted and play it
   */
  playVideo(): void {
    this.playVideoInterval = setInterval(() => {
      const video = document.getElementById('autoplay') as HTMLVideoElement;
      if (video) {
        video.muted = true;
        video.loop = true;
        video.play();
        clearInterval(this.playVideoInterval);
      }
    }, 1000);
  }

  /**
   * Clicks connect wallet button
   */
  connectWallet(): void {
    document.getElementById('connect-wallet')?.click();
  }

  /**
   * Sets the allowed NFTs
   */
  setAllowedNFTs(): void {
    this.allowedNFTs = [];
    for (const p in partners) {
      if (partners[p].nfts) {
        this.allowedNFTs = this.allowedNFTs.concat(partners[p].nfts);
      }
    }
    this.allowedNFTs = this.allowedNFTs.map( (i: any) => i.toLowerCase() );
    console.log('partners');
    console.log(this.allowedNFTs);
  }

  /**
   * Switcher to toggle data containers
   * @param {number} block : number of the block to switch
   */
  toggleData(block: number): void {
    console.log(block);
    switch (block) {
      case 0:
        this.showPriceHistory = !this.showPriceHistory;
        break;
      case 1:
        this.showAbout = !this.showAbout;
        break;
      case 2:
        this.showAttributes = !this.showAttributes;
        break;
      case 3:
        this.showHistory = !this.showHistory;
        break;
      case 4:
        this.showMetadata = !this.showMetadata;
        break;
    }
  }

  /**
   * Gets data of the NFT
   * @param {number} id : id of the token
   * @param {string} type : type of the token (weapon, armor, exo...)
   */
  async getNftData(id: number, nftContractAddress: string): Promise<void> {
    console.log('loading');
    this.loadingData = true;
    this.nftData = await this.partnerNftService.getOneNftData(id, nftContractAddress);
    this.nftSaleData = await this.getSaleData();
    this.getWalletImage();
    this.getNftPriceData();
    this.checkRedeemability();
    console.log(this.nftData);
    console.log(this.saleType);
    console.log(this.nftSaleData);
    this.loadingData = false;
    console.log('loaded');
  }

  /**
   * Checks de redeemability of the NFT
   */
  checkRedeemability(): void {
    try {
      const redeemLimit = this.nftData.attributes.find((item: any) => item.trait_type === 'Redeem Date').value;
      const limitPassed = parseInt(redeemLimit, 0) > (Date.now() / 1000);
      if (this.nftData.redeem_status.toLowerCase() === 'not redeemed' && limitPassed){
        this.nftIsRedeemable = true;
      } else {
        this.nftIsRedeemable = false;
      }
    } catch (error: any) {
      this.nftIsRedeemable = false;
    }
  }

  /**
   * Gets the price of the NFT
   */
  async getNftPriceData(): Promise<void> {
    const updatedData = await this.getSaleData();
    this.nftSaleData = {
      ...this.nftSaleData,
      minPrice: updatedData.minPrice,
      nftHighestBid: updatedData.nftHighestBid,
      nftHighestBidder: updatedData.nftHighestBidder
    }
    this.buyPriceWei = await this.getBuyPrice();
    this.buyPrice = parseFloat(this.connectionService.fromWei(this.buyPriceWei)).toString();
    this.buyCoin = await this.tokenService.getCoinTickerByAddress(this.nftSaleData.ERC20Token);
    this.nextBidPrice = await this.getNextBidPrice();
    await this.getValueOnBusd();
  }

  /**
   * Gets data of the sale/auction
   * @returns {any} : object with the data
   */
  async getSaleData(): Promise<any> {
    // On refactor: Mantain auxSaleType, get sale data is used on data updating
    let auxSaleType = 'none';
    let data = await this.partnerSellService.getSaleData(parseInt(this.nftData.id, 0), this.nftData.nftContractAddress);
    if (data.nftSeller === this.zeroAddress) {
      data = await this.partnerEnglishAuctionService.getAuctionData(parseInt(this.nftData.id, 0), this.nftData.nftContractAddress);
      if (data.nftSeller === this.zeroAddress) {
        // Add dutch auction when SC is done
        // auxSaleType = 'dutch';
      } else {
        auxSaleType = 'english';
      }
    } else {
      auxSaleType = 'sell';
    }
    if (this.saleType !== auxSaleType) { this.saleType = auxSaleType; }
    return data;
  }

  /**
   * Gets the image for the user according to wallet first number
   */
  getWalletImage(): void {
    if (this.nftSaleData.nftSeller !== this.zeroAddress) {
      this.profileImage = this.utilsService.getWalletImage(this.nftSaleData.nftSeller);
    } else if (this.nftData.owner !== this.zeroAddress) {
      this.profileImage = this.utilsService.getWalletImage(this.nftData.owner);
    } else {
      this.profileImage = -1;
    }
  }

  /**
   * Gets the actual buy price
   * @returns {string} : the buy/bid price
   */
  async getBuyPrice(): Promise<string> {
    switch (this.saleType) {
      case 'sell':
        return this.nftSaleData.buyPrice;
      case 'english':
        this.initialPrice = this.connectionService.fromWei(this.nftSaleData.minPrice);
        return this.nftSaleData.nftHighestBid;
      case 'dutch':
        return this.nftSaleData.minPrice;
      case 'none':
        return '0';
      default:
        return '0';
    }
  }

  /**
   * Get the price changed to busd value
   */
  async getValueOnBusd(): Promise<void> {
    let address = '';
    if (this.buyCoin === 'GQ') {
      address = contractAddresses.gq;
    } else if (this.buyCoin === 'BNB') {
      address = this.zeroAddress;
    } else if (this.buyCoin === 'BUSD') {
      this.priceInBUSD = parseInt(this.buyPrice, 0);
    }

    if (this.buyCoin === 'GQ' || this.buyCoin === 'BNB') {
      if (this.buyCoin === 'GQ') {
        this.priceInBUSD = gqPriceOnBusd[0] * parseFloat(this.buyPrice);
      } else {
        this.priceInBUSD = bnbPriceOnBusd[0] * parseFloat(this.buyPrice);
      }
    }
  }

  /**
   * Transfer directly the NFT to another wallet
   */
  async directTransfer(): Promise<void> {
    this.openBuyAsGift('Direct transfer').afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        await this.partnerSellService.directTransfer(data, parseInt(this.nftData.id, 0), this.nftData.nftContractAddress, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Puts the NFT on sale
   */
  async putOnSale(): Promise<void> {
    this.openPutOnSalePopUp('putSale', '').afterClosed().subscribe( async (data: any) => {
      if (data) {
        console.log(data);
        await this.partnerSellService.putOnSale(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), data.amount, data.token, this.nftData.name, data.sendFeeTo, data.extraFeePercentage).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Removes the NFT from the sale
   */
  async removeFromSale(): Promise<void> {
    await this.partnerSellService.removeFromSale(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), this.nftData.name).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
      }
    });
  }

  /**
   * Sets the price of the NFT on sale
   */
  async setPrice(): Promise<void> {
    this.openPutOnSalePopUp('change', this.buyCoin).afterClosed().subscribe( async (data: any) => {
      if (data){
        await this.partnerSellService.setSalePrice(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), data.amount, this.buyCoin, data.sendFeeTo, data.extraFeePercentage).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Buy NFT
   * @param {string} sendTo : the wallet the NFT will be sent to
   */
  async buyNft(sendTo: string): Promise<void> {
    await this.partnerSellService.buyNft(this.nftData.nftContractAddress, this.nftData.id, this.buyPriceWei, this.nftData.name, this.buyCoin, sendTo).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
      }
    });
  }

  /**
   * Opens pop up to buy NFT as a gift for other wallet
   */
  async buyAsGift(): Promise<void> {
    this.openBuyAsGift('buyAsGift').afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        this.buyNft(data);
      }
    });
  }

  /**
   * Put the NFT on auction
   */
  async putOnAuction(): Promise<void> {
    this.openPutOnSalePopUp('putAuction', '').afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        await this.partnerEnglishAuctionService.putOnAuction(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), data.amount, data.token, data.auctionTime, data.bidPercentage, this.nftData.name, data.sendFeeTo, data.extraFeePercentage).then( (res: any) => {
          console.log(res);
          if (res) {
            this.auctionEnded = false;
            this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Automatic bid on NFT auction, always lowest bid possible
   */
  async bidOnAuctionAuto(): Promise<void> {
    await this.partnerEnglishAuctionService.addBid(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), this.nextBidPrice, this.buyCoin, this.nftData.name).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
      }
    });
  }

  /**
   * Bid on the NFT auction with custom bid amount
   */
  async bidOnAuctionCustom(): Promise<void> {
    this.openBidOnAuction('bidOnAuction', this.saleType, this.initialPrice, this.buyPrice, this.buyCoin, this.nextBidPrice).afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        await this.partnerEnglishAuctionService.addBid(this.nftData.nftContractAddress, parseInt(this.nftData.id, 0), data, this.buyCoin, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Gets the next minimum bid
   * @returns {number} : the amount of the next minimum bid
   */
  async getNextBidPrice(): Promise<number> {
    const amount = parseFloat(this.buyPrice);
    const increase = (parseFloat(this.nftSaleData.bidIncreasePercentageInBP) / 10000) + 1;
    const result = amount * increase;
    let returnData = (Math.ceil(result * 10000)) / 10000;
    if (returnData === 0) {
      const minPrice = this.connectionService.fromWei(this.nftSaleData.minPrice);
      returnData = parseFloat(minPrice);
    }
    return returnData;
  }

  /**
   * Withdraw NFT once the auction is over
   */
  async withdrawAuction(): Promise<void> {
    await this.partnerEnglishAuctionService.withdrawAuction(parseInt(this.tokenId, 0), this.nftData.nftContractAddress).then( (res: any) => {
      if (res) {
        this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
      }
    });
  }

  // Pop up opening functions

  /**
   * Opens pop up to put on sale
   * @param type : action of the sale (put on sale or change price)
   * @param coin : coin used on the sale
   * @returns : the dialog
   */
  openPutOnSalePopUp(type: string, coin: string): any  {
    return this.dialog.open(PartnerPopUpPutOnSaleComponent, {
      panelClass: 'sale-dialog-container',
      data: { type, coin, saleData: this.nftSaleData }
    });
  }

  /**
   * Opens pop up to buy as gift
   * @param {string} title : The title for the popup
   * @returns : the dialog
   */
  openBuyAsGift(title: string): any  {
    return this.dialog.open(PopUpBuyAsGiftComponent, {
      panelClass: 'sale-dialog-container',
      data: { title }
    });
  }

  /**
   * Opens pop up to bid on auction
   * @param {string} title : The title for the popup
   * @param {string} type : the sale type
   * @param {string} initialPrice : the initial price
   * @param {string} actualPrice : the actual price
   * @param {string} coin : used coin for this bid
   * @param {number} minBid : minimum bid
   * @returns : the dialog
   */
  openBidOnAuction(title: string, type: string, initialPrice: string, actualPrice: string, coin: string, minBid: number): any  {
    return this.dialog.open(PopUpBidOnAuctionComponent, {
      panelClass: 'sale-dialog-container',
      data: { title, type, initialPrice, actualPrice, coin, minBid }
    });
  }

  /**
   * Subscribe to the query to get the historic data of the NFT transfers
   */
  async getTransfersData(): Promise<void> {
    const id = ('0x' + parseInt(this.tokenId, 0).toString(16) + this.nftContractAddress).toLowerCase();
    console.log(id);
    const votesQuery = this.apollo.use('partners').watchQuery({
      query: getPartnersNftTransferData,
      pollInterval: 10000,
      variables: {
        id
      }
    });
    this.querySubscription = votesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log(res);
        if (res.data.nfts.length > 0) {
          this.setTransfersArray(res.data.nfts[0].activities);
        }
    });
  }

  /**
   * Manage the data received on the activities query
   * @param {any} data : received from query
   */
  async setTransfersArray(frozenData: Array<any>): Promise<any> {
    try {
      let data = JSON.parse( JSON.stringify( frozenData ) );
      for (let tx of data) {
        const block = await this.connectionService.getBlockTimestamp(tx.block);
        tx.timestamp = new Date(block.timestamp * 1000);
      }
      this.nftTransfers = data.sort((a, b) => {
        if (a.timestamp < b.timestamp) { return 1; }
        if (a.timestamp > b.timestamp) { return -1; }
        else { return 0; }
      });
      console.log(this.nftTransfers);
    } catch (error) {
      console.log(error);
    }

  }

  /**
   * Redeem NFT to receive the reward
   */
  async redeemToReceive(): Promise<void> {
    this.openBurnToReceive().afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data === true) {
        this.getNftData(parseInt(this.tokenId, 0), this.nftContractAddress);
      }
    });
  }

  /**
   * Opens the pop up to redeem the NFT
   * @returns : the dialog
   */
  openBurnToReceive(): any  {
    return this.dialog.open(PartnerPopUpBurnToReceiveComponent, {
      panelClass: 'partner-burn-receive-dialog-container',
      disableClose: true,
      data: {
        partner: this.partner,
        tokenId: this.tokenId,
        nftContractAddress: this.nftContractAddress,
        match: this.nftData.name
      }
    });
  }

}
