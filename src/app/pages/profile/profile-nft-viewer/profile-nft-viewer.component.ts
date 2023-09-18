import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NftService } from 'src/app/shared/services/nft/nft.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Apollo } from 'apollo-angular';
import { getWalletAuctions, getWalletDoneBids, getWalletNfts, getWalletSales } from 'src/app/constants/gqlQueries';

@Component({
  selector: 'app-profile-nft-viewer',
  templateUrl: './profile-nft-viewer.component.html',
  styleUrls: ['./profile-nft-viewer.component.scss']
})
export class ProfileNftViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() wallet: any;
  loadingMedalsData: boolean = true;
  loadingInventoryData: boolean = true;
  loadingSalesData: boolean = true;
  loadingAuctionsData: boolean = true;
  loadingBidsData: boolean = true;
  profileImage: number = -1;

  selectedCategory = 'Weapons';
  selectedCategoryNum = 6;
  activeTab = 'inventory';

  nftInventory: Array<any> = [];
  nftOnSale: Array<any> = [];
  nftOnBid: Array<any> = [];
  allDoneBids: Array<any> = [];
  userLands: Array<any> = [];

  // DOWHEN: New OR NFT added, add new nft name to the end position of the next array, and 'not queried' to the end position of the following array
  allCategories = ['Armor','ClanBadge','Exocredit','Cosmetic','LandVehicle','Weapon','Land', 'Key'];
  queriedCategory = ['not queried','not queried','not queried','not queried','not queried','Weapon','not queried','not queried'];

  walletQuery: any;
  walletQuerySubscription: any;
  salesQuery: any;
  salesQuerySubscription: any;
  auctionsQuery: any;
  auctionsQuerySubscription: any;
  bidsQuery: any;
  bidsQuerySubscription: any;

  constructor(
    private nftService: NftService,
    private utilsService: UtilsService,
    private apollo: Apollo
  ) { }

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getInventoryData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.wallet.currentValue) {
      this.getInventoryData();
    }
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.salesQuerySubscription) { this.salesQuerySubscription.unsubscribe(); }
    if (this.auctionsQuerySubscription) { this.auctionsQuerySubscription.unsubscribe(); }
    if (this.walletQuerySubscription) { this.walletQuerySubscription.unsubscribe(); }
    if (this.bidsQuerySubscription) { this.bidsQuerySubscription.unsubscribe(); }
  }

  /**
   * Gets all inventory data
   */
  async getInventoryData(): Promise<any> {
    if (this.wallet && this.wallet !== '') {
      this.getWalletNft(this.wallet);
      this.getWalletSales(this.wallet);
      this.getWalletAuctions(this.wallet);
    }
  }

  /**
   * Gets user's NFTs on wallet subscribing to query
   * @param {string} userAddr : the wallet of the user
   */
  async getWalletNft(userAddr: string): Promise<any> {
    if (this.walletQuerySubscription) { this.walletQuerySubscription.unsubscribe(); }
    this.loadingInventoryData = true;
    userAddr = userAddr.toLowerCase();
    this.walletQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletNfts,
      pollInterval: 3000,
      // DOWHEN: New OR NFT added, add new nft to the end position of the variable
      variables: {
        wallet: userAddr,
        armors: this.queriedCategory[0],
        clanBadges: this.queriedCategory[1],
        exocredits: this.queriedCategory[2],
        cosmetics: this.queriedCategory[3],
        landVehicles: this.queriedCategory[4],
        spaceVehicles: this.queriedCategory[4],
        weapons: this.queriedCategory[5],
        lands: this.queriedCategory[6],
        keys: this.queriedCategory[7]
      }
    });
    this.walletQuerySubscription = this.walletQuery
      .valueChanges
      .subscribe( async (res: any) => {
        if (res) {
          let dataArray: any[] = [];
          // Concats all result arrays in one
          for (let arr in res.data.inventory[0]) {
            if (Array.isArray(res.data.inventory[0][arr])) {
              dataArray = dataArray.concat(res.data.inventory[0][arr]);
            }
          }
          res = await this.utilsService.parseMetadata(dataArray);
          this.nftInventory = res;
        }
        console.log('- NFT on wallet');
        console.log(this.nftInventory);
        this.loadingInventoryData = false;
      });
  }

  /**
   * Gets user's NFTs on sale subscribing to query
   * @param {string} userAddr : the wallet of the user
   */
  async getWalletSales(userAddr: string): Promise<any> {
    if (this.salesQuerySubscription) { this.salesQuerySubscription.unsubscribe(); }
    this.loadingSalesData = true;
    userAddr = userAddr.toLowerCase();
    const nftContractAddress = await this.getAddressForQuery();
    this.salesQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletSales,
      pollInterval: 3000,
      variables: {
        wallet: userAddr,
        nftContractAddress
      }
    });
    this.salesQuerySubscription = this.salesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.sales);
        this.nftOnSale = res;
        console.log('- NFT on sale');
        console.log(this.nftOnSale);
        this.loadingSalesData = false;
      });
  }

  /**
   * Gets user's NFTs on auction subscribing to query
   * @param {string} userAddr : the wallet of the user
   */
  async getWalletAuctions(userAddr: string): Promise<any> {
    if (this.auctionsQuerySubscription) { this.auctionsQuerySubscription.unsubscribe(); }
    this.loadingAuctionsData = true;
    userAddr = userAddr.toLowerCase();
    const nftContractAddress = await this.getAddressForQuery();
    this.auctionsQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletAuctions,
      pollInterval: 3000,
      variables: {
        wallet: userAddr,
        nftContractAddress
      }
    });
    this.auctionsQuerySubscription = this.auctionsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.auctions);
        this.nftOnBid = res;
        console.log('- NFT on auction');
        console.log(this.nftOnBid);
        this.loadingAuctionsData = false;
      });
  }

  /**
   * Gets the NFTs where user has done any bid subscribing to query
   */
  async getUserBids(): Promise<any> {
    if (this.bidsQuerySubscription) { this.bidsQuerySubscription.unsubscribe(); }
    this.loadingBidsData = true;
    const userAddr: string = this.wallet.toLowerCase();
    this.bidsQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletDoneBids,
      pollInterval: 3000,
      variables: {
        wallet: userAddr
      }
    });
    this.bidsQuerySubscription = this.bidsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseTokenURI(res.data.auctions);
        this.allDoneBids = res;
        console.log('Get user done bids:');
        console.log(this.allDoneBids);
        this.loadingBidsData = false;
      });
  }

  /**
   * Sets the active tab
   * @param {string} newTab : new tab to change to
   */
  setActiveTabTo(newTab: string): void {
    this.activeTab = newTab;
    if (newTab === 'bids') {
      this.getUserBids();
    }
  }

  /**
   * Changes the selected category on inventory tab
   * @param {string} cat : category name to change to
   */
  async changeSelectedCategory(catNum: number, cat: string): Promise<void> {
    this.selectedCategory = cat;
    this.selectedCategoryNum = catNum;
    this.queriedCategory = [];
    for (let i = 0; i < this.allCategories.length; i++) {
      if (i === catNum) {
        this.queriedCategory.push(this.allCategories[i]);
      } else {
        this.queriedCategory.push('not queried');
      }
    }
    this.getWalletNft(this.wallet);
    this.getWalletSales(this.wallet);
    this.getWalletAuctions(this.wallet);
  }

  async getAddressForQuery(): Promise<string[]> {
    if (this.selectedCategoryNum === 4) {
      return [await this.nftService.getNftAddressByCategoryName('landVehicle'), await this.nftService.getNftAddressByCategoryName('spaceVehicle')];
    } else {
      return [await this.nftService.getNftAddressByCategoryName(this.selectedCategory)];
    }
  }

}
