import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { activeUser } from 'src/app/constants/inventory';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { NftService } from 'src/app/shared/services/nft/nft.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { EnglishAuctionService } from 'src/app/shared/services/trading/english-auction.service';
import { SellService } from 'src/app/shared/services/trading/sell.service';
import { PopUpBidOnAuctionComponent } from '../pop-up-bid-on-auction/pop-up-bid-on-auction.component';
import { PopUpBuyAsGiftComponent } from '../pop-up-buy-as-gift/pop-up-buy-as-gift.component';
import { PopUpPutOnSaleComponent } from '../pop-up-put-on-sale/pop-up-put-on-sale.component';
import { getNftTransferData } from 'src/app/constants/gqlQueries';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { Location } from '@angular/common';

/**
 * Detail page for the NFT
 */
@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss']
})
export class NftComponent implements OnInit, OnDestroy {
  nftOwner: string;
  nftFirstOwner: string;
  tokenId: number;
  nftContractAddress: string;
  isOrNft: boolean;
  nftData: any;
  nftSaleData: any;
  buyPrice = '';
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
  playVideoInterval: any;

  // Booleans to show/hide panels
  showAbout: boolean = true;
  showAttributes: boolean = true;
  showAbilities: boolean = true;
  showHistory: boolean = true;
  showPriceHistory: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sellService: SellService,
    private englishAuctionService: EnglishAuctionService,
    private nftService: NftService,
    private connectionService: ConnectionService,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private apollo: Apollo,
    private location: Location
  ) {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      this.tokenId = params.id;
      this.nftContractAddress = params.nftContractAddress;
      console.log(this.tokenId, this.nftContractAddress);
      this.checkIfIsOrNft(this.nftContractAddress);
      this.getNftData(this.tokenId, this.nftContractAddress);
    });
  }

  /**
   * Set interval to get Price data and refresh each 10 seconds
   */
  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.getNftPriceData();
    }, 10000);
    this.getTransfersData();
    this.playVideo();
  }

  /**
   * Clears interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  checkIfIsOrNft(nftAddress: string): void {
    this.isOrNft = Object.values(contractAddresses).some((nft: any) => nft.toLowerCase() === nftAddress.toLowerCase());
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
   * Switcher to toggle data containers
   * @param {number} block : number of the block to switch
   */
  toggleData(block: number): void {
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
        this.showAbilities = !this.showAbilities;
        break;
      case 4:
        this.showHistory = !this.showHistory;
        break;
    }
  }

  /**
   * Gets data of the NFT
   * @param {number} id : id of the token
   * @param {string} nftContractAddress : contract address of the NFT
   */
  async getNftData(id: number, nftContractAddress: string): Promise<void> {
    console.log('loading');
    this.loadingData = true;
    this.nftData = await this.nftService.getNftData(id, nftContractAddress);
    this.nftOwner = await this.nftService.getOwner(id, nftContractAddress);
    this.nftFirstOwner = await this.nftService.getFirstOwner(id, nftContractAddress);
    this.nftSaleData = await this.getSaleData();
    await this.getNftPriceData();
    console.log(this.nftData);
    console.log(this.saleType);
    console.log(this.nftSaleData);
    this.loadingData = false;
    if (this.nftContractAddress.toLowerCase() === contractAddresses.land.toLowerCase()) {
      this.getLandSize();
    }
    console.log('loaded');
  }

  /**
   * Gets the land size from the land NFT attributes
   */
  getLandSize(): void {
    this.nftData.size = this.nftData.attributes.find((item: any) => item.trait_type.toLowerCase() === 'size').value;
  }

  /**
   * Gets the price of the NFT
   */
  async getNftPriceData(): Promise<any> {
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
    const saledata = await this.sellService.getSaleData(parseInt(this.nftData.id, 0), this.nftData.contractAddress);
    const auctionData = await this.englishAuctionService.getAuctionData(parseInt(this.nftData.id, 0), this.nftData.contractAddress);
    console.log(saledata, auctionData);
    if (saledata && auctionData) {
      return this.setSaleType(saledata, auctionData);
    } else {
      return await this.getSaleData();
    }
  }

  setSaleType(saleData: any, auctionData: any): void {
    if (saleData.nftSeller !== this.zeroAddress) {
      this.saleType = 'sell';
      return saleData;
    } else if (auctionData.nftSeller !== this.zeroAddress) {
      this.saleType = 'english';
      return auctionData;
    } else {
      this.saleType = 'none';
      return saleData;
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
      this.priceInBUSD = parseFloat(this.buyPrice);
    }
    if (this.buyCoin === 'GQ' || this.buyCoin === 'BNB') {
      let price = this.buyPrice;
      if (this.saleType !== 'sell') {
        price = this.nextBidPrice.toString();
      }
      if (this.buyCoin === 'GQ') {
        this.priceInBUSD = gqPriceOnBusd[0] * parseFloat(price);
      } else {
        this.priceInBUSD = bnbPriceOnBusd[0] * parseFloat(price);
      }
    }
    console.log(this.priceInBUSD);
  }

  /**
   * Transfer directly the NFT to another wallet
   */
  async directTransfer(): Promise<void> {
    this.openBuyAsGift('Direct transfer').afterClosed().subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        await this.sellService.directTransfer(data, parseInt(this.nftData.id, 0), this.nftData.contractAddress, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(this.tokenId, this.nftContractAddress);
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
        await this.sellService.putOnSale(this.nftData.contractAddress, parseInt(this.nftData.id, 0), data.amount, data.token, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(this.tokenId, this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Removes the NFT from the sale
   */
  async removeFromSale(): Promise<void> {
    await this.sellService.removeFromSale(this.nftData.contractAddress, parseInt(this.nftData.id, 0), this.nftData.name).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(this.tokenId, this.nftContractAddress);
      }
    });
  }

  /**
   * Sets the price of the NFT on sale
   */
  async setPrice(): Promise<void> {
    this.openPutOnSalePopUp('change', this.buyCoin).afterClosed().subscribe( async (data: any) => {
      await this.sellService.setSalePrice(this.nftData.contractAddress, parseInt(this.nftData.id, 0), data.amount, this.buyCoin).then( (res: any) => {
        console.log(res);
        if (res) {
          this.getNftData(this.tokenId, this.nftContractAddress);
        }
      });
    });
  }

  /**
   * Buy NFT
   * @param {string} sendTo : the wallet the NFT will be sent to
   */
  async buyNft(sendTo: string): Promise<void> {
    await this.sellService.buyNft(this.nftData.contractAddress, this.nftData.id, this.buyPriceWei, this.nftData.name, this.buyCoin, sendTo).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(this.tokenId, this.nftContractAddress);
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
        await this.englishAuctionService.putOnAuction(this.nftData.contractAddress, parseInt(this.nftData.id, 0), data.amount, data.token, data.auctionTime, data.bidPercentage, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.auctionEnded = false;
            this.getNftData(this.tokenId, this.nftContractAddress);
          }
        });
      }
    });
  }

  /**
   * Automatic bid on NFT auction, always lowest bid possible
   */
  async bidOnAuctionAuto(): Promise<void> {
    await this.englishAuctionService.addBid(this.nftData.contractAddress, parseInt(this.nftData.id, 0), this.nextBidPrice, this.buyCoin, this.nftData.name).then( (res: any) => {
      console.log(res);
      if (res) {
        this.getNftData(this.tokenId, this.nftContractAddress);
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
        await this.englishAuctionService.addBid(this.nftData.contractAddress, parseInt(this.nftData.id, 0), data, this.buyCoin, this.nftData.name).then( (res: any) => {
          console.log(res);
          if (res) {
            this.getNftData(this.tokenId, this.nftContractAddress);
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
    await this.englishAuctionService.withdrawAuction(this.tokenId, this.nftData.contractAddress).then( (res: any) => {
      if (res) {
        this.getNftData(this.tokenId, this.nftContractAddress);
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
    return this.dialog.open(PopUpPutOnSaleComponent, {
      panelClass: 'sale-dialog-container',
      data: { type, coin }
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
    let id = this.tokenId;
    if (this.nftContractAddress.toLowerCase() === contractAddresses.land.toLowerCase()) {
      this.getLandTransfersData(id, this.nftContractAddress.toLowerCase());
    }
    else {
      const activitiesQuery = this.apollo.use('marketplace').watchQuery({
        query: getNftTransferData,
        pollInterval: 1000,
        variables: {
          id,
          nftContractAddress: this.nftContractAddress
        }
      });
      this.querySubscription = activitiesQuery
        .valueChanges
        .subscribe( async (res: any) => {
          console.log(res);
          if (res.data.activities.length > 0) {
            this.setTransfersArray(res.data.activities);
          }
      });
    }
  }

  /**
   * Subscribe to the query to get the historic data of the NFT transfers of a land NFT
   * @param id token id
   * @param nftContractAddress address of the NFT Smart Contract
   */
  async getLandTransfersData(id: any, nftContractAddress: string): Promise<any> {
    const landActivitiesQuery = this.apollo.use('lands').watchQuery({
      query: getNftTransferData,
      pollInterval: 1000,
      variables: {
        id,
        nftContractAddress
      }
    });
    this.querySubscription = landActivitiesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log(res);
        if (res.data.activities.length > 0) {
          this.setTransfersArray(res.data.activities);
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

  goToPreviousPage(): void {
    this.location.back();
  }

}
