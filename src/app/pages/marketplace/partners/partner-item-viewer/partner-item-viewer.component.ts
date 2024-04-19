import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { partners } from 'src/app/constants/partnerships';
import { Apollo } from 'apollo-angular';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { getPartnerNftOnAuction, getPartnerNftOnSale, getPartnerNftOnWallet } from 'src/app/constants/gqlQueries';

/**
 * Item viewer for Partners Marketplace
 */
@Component({
  selector: 'app-partner-item-viewer',
  templateUrl: './partner-item-viewer.component.html',
  styleUrls: ['./partner-item-viewer.component.scss']
})
export class PartnerItemViewerComponent implements OnInit, OnDestroy {
  @Input() category: string;
  @Input() title: string;
  @Input() partnerNfts: string[];
  query: any;
  querySubscription: any;
  items: any[] = [];
  shownItems: any[] = [];
  loadingData: boolean = true;
  walletIsConnected: any = false;
  userAddress: string = '';
  // Filter and sorting
  // TODO: control filter showing
  filterIsShowing: boolean = true;
  filter: any;
  allFilters: string[] = [];
  activeFilters: Array<string>[] = [ [], [], [], [], []];
  selectedSorting: string = 'Sorting';
  // Pagination
  itemsPerPage: number = 8; // Set this to default items per page
  paginationPage: number = 0;
  totalPages: number = 1;

  constructor(
    private apollo: Apollo,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    this.getNFTs();
    this.setTotalPages();
    this.setFilter();
  }

  /**
   * Unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Gets the NFTs from graph query
   */
  getNFTs(): void {
    if (this.title.toLowerCase() === 'wallet') {
      this.connectionService.userAccount.subscribe( (userAccount: any) => {
        this.walletIsConnected = userAccount.isConnected;
        if (this.walletIsConnected) {
          this.userAddress = this.connectionService.getWalletAddress().toLowerCase();
          this.getPartnerNFT('wallet', getPartnerNftOnWallet, this.partnerNfts, this.userAddress);
        } else {
          if (this.querySubscription) { this.querySubscription.unsubscribe(); }
          this.items = [];
          this.shownItems = [];
        }
      });
    }
    else if (this.title.toLowerCase() === 'sales') {
      this.getPartnerNFT('sale', getPartnerNftOnSale, this.partnerNfts, '');
    }
    else if (this.title.toLowerCase() === 'auctions') {
      this.getPartnerNFT('auction', getPartnerNftOnAuction, this.partnerNfts, '');
    }
  }


  /**
   * Subscribe to diferent queries to get NFTs
   * @param {string} where : sale, auction or wallet
   * @param {any} query : query to use for the subscription
   * @param {Array<string>} nftContractAddress : array of strings with the partners NFTs addresses
   * @param {string} userAddress : wallet of the user
   */
  async getPartnerNFT(where: string, query: any, nftContractAddress: Array<string>, userAddress: string): Promise<any> {
    console.log('works')
    userAddress = userAddress.toLowerCase();
    nftContractAddress = nftContractAddress.map(name => name.toLowerCase());
    this.query = this.apollo.use('partners').watchQuery({
      query,
      pollInterval: 3000,
      variables: {
        nftAddresses: nftContractAddress,
        wallet: userAddress
      }
    });
    this.querySubscription = this.query.valueChanges.subscribe(async (res: any) => {
      const data = res.data.response;
      this.items = [];
      if (data.length > 0 && where === 'wallet') {
        this.items = await this.pushNftsToArray(where, data[0].nfts);
      } else if (data.length > 0 && where !== 'wallet') {
        this.items = await this.pushNftsToArray(where, data);
      }
      this.shownItems = await this.getFilteredArray();
      this.setTotalPages();
      this.loadingData = false;
      console.log(this.shownItems);
      console.log(this.items);
    });
  }

  /**
   *
   * @param {string} where : sale, auction or wallet
   * @param {Array<any>} nfts : array with the NFTs from the query
   * @returns {Array<any>} : the array after being processed
   */
  async pushNftsToArray(where: string, nfts: Array<any>): Promise<Array<any>> {
    let newArray = [];
    for (const nft of nfts) {
      if (!this.items.some( (item: any) => item.tokenId === nft.tokenId && item.nftContractAddress.toLowerCase() === nft.nftContractAddress.toLowerCase())) {
        try {
          let data = await this.parseStringMetadataJson(nft);
          if (data === '') {
            data = await this.parseUriMetadataJson(nft);
          }
          data.tokenId = nft.tokenId;
          data.nftContractAddress = nft.nftContractAddress;
          newArray.push(data);
        } catch (error: any) { }
      } else {
        const item = this.items.find( (item: any) => item.tokenId === nft.tokenId && item.nftContractAddress.toLowerCase() === nft.nftContractAddress.toLowerCase());
        if (item){
          newArray.push(item);
        }
      }
    }
    return newArray;
  }

  /**
   * Parse the metadata field to json format
   * @param {any} nft : object with the NFT data
   * @returns the NFT data processed
   */
  async parseStringMetadataJson(nft: any): Promise<any> {
    let data: any;
    const metadata = nft.metadata ? nft.metadata.uriString : nft.partnerNFT.metadata ? nft.partnerNFT.metadata.uriString : '';
    if (metadata !== '') {
      data =  { ...JSON.parse(metadata), ...nft };
    } else {
      data = '';
    }
    return data;
  }

  /**
   * Parses the metadata uri to json format
   * @param {any} nft : object with the NFT data
   * @returns : the NFT data processed
   */
  async parseUriMetadataJson(nft: any): Promise<any> {
    let data: any;
    const fullTokenURI = nft.fullTokenURI ? nft.fullTokenURI : nft.partnerNFT.fullTokenURI ? nft.partnerNFT.fullTokenURI : '';
    const tokenURI = nft.tokenURI ? nft.tokenURI : nft.partnerNFT.tokenURI ? nft.partnerNFT.tokenURI : '';
    if (fullTokenURI !== '') {
      data = await fetch(fullTokenURI).then((response) => response.json());
    } else if (tokenURI !== '') {
      data = {
        ...await fetch('https://gateway.pinata.cloud/ipfs/' + tokenURI).then((response) => response.json()),
        ...nft
      };
    } else {
      data = {};
    }
    return data;
  }

  /**
   * Pagination
   */
  changePage(isNext: boolean): void {
    let movement = 1;
    if (!isNext) { movement = -1; }
    this.paginationPage += movement;
  }

  /**
   * Set the total page amount
   */
  setTotalPages(): void {
    this.totalPages = Math.ceil(this.shownItems.length / this.itemsPerPage) - 1;
  }

  /**
   * Sets the item amount to show on pagination
   * @param itemAmount item amount to set
   */
  setItemsPerPage(itemAmount: number): void {
    this.itemsPerPage = itemAmount;
    this.setTotalPages();
    this.paginationPage = this.paginationPage <= this.totalPages ? this.paginationPage : this.totalPages;
  }

  /**
   * Sets the filters for the partner
   */
  async setFilter(): Promise<void> {
    this.allFilters = [];
    this.activeFilters = [ [], [], [], [], []];
    this.filter = partners[this.category].filter;
  }

  /**
   * Open and close clicked filter
   * @param {string} id : clicked filter id
   */
  filterSwitcher(id: string): void {
    document.getElementById(id)?.classList.toggle('hidden');
  }

  /**
   * Show or hide filter on responsive
   */
  switchFilterVisibility(): void {
    this.filterIsShowing = !this.filterIsShowing;
  }

  /**
   * Functions to filter array with seleted filters
   * @param {any} event : click event
   * @param {number} filterIndex : the index of the clicked filter
   */
  async filterData(event: any, filterIndex: number): Promise<void> {
    // Set filter
    document.getElementById(event.target.id)?.classList.toggle('active');
    if (this.activeFilters[filterIndex].includes(event.target.id)) {
      this.activeFilters[filterIndex].splice(this.activeFilters[filterIndex].indexOf(event.target.id), 1);
    } else {
      this.activeFilters[filterIndex].push(event.target.id);
    }

    if (this.allFilters.includes(event.target.id)) {
      this.allFilters.splice(this.allFilters.indexOf(event.target.id), 1);
    } else {
      this.allFilters.push(event.target.id);
    }

    // Filter array
    let filteredItems = await this.getFilteredArray();
    console.log(filteredItems);
    this.shownItems = filteredItems;
    this.setTotalPages();
    console.log(this.activeFilters)
    console.log(this.allFilters)
  }

  /**
   * Filters the array
   * @returns {any} the array after filtering
   */
  async getFilteredArray(): Promise<any[]> {
    let controlArray = this.items;
    if (this.allFilters.length === 0) { return this.items; }
    for (const activef of this.activeFilters) {
      let auxArray = [];
      if (activef.length === 0) { continue; }
      for (const f of activef) {
        let aux2Array = controlArray.filter( i => {
          if (Object.values(i).includes(f)) { return i; }
          for (let i2 of Object.values(i.attributes)) {
            if (Object.values(i2).includes(f)) { return i2; }
          }
        });
        for (const x of aux2Array) {
          auxArray.push(x);
        }
      }
      controlArray = [];
      controlArray = auxArray;
    }
    return controlArray;
  }

  // Functions to sort shown items
  /**
   * Sets the selected sorting
   * @param {string} newSort : new sort to change to
   */
  setSelectedSorting(newSort: string): void {
    if (newSort === this.selectedSorting) {
      this.selectedSorting = 'Sorting';
    } else {
      this.selectedSorting = newSort;
    }
  }

  /**
   * Sorts the array by price
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : new sort type
   */
  async sortArrayByPrice(sortToUp: boolean, newSort: string): Promise<void> {
    this.setSelectedSorting(newSort);
    let newArray = this.items;
    const pricesOnBusd = {
      [contractAddresses.bnb.toLowerCase()]: bnbPriceOnBusd[0], // BNB
      [contractAddresses.busd.toLowerCase()]: 1, // BUSD
      [contractAddresses.gq.toLowerCase()]: gqPriceOnBusd[0]  // GQ
    };
    newArray.sort( (a, b) => {
      const aPrice = parseFloat(this.connectionService.fromWei(a.buyPrice)) * pricesOnBusd[a.erc20Token.toLowerCase()];
      const bPrice = parseFloat(this.connectionService.fromWei(b.buyPrice)) * pricesOnBusd[b.erc20Token.toLowerCase()];
      let res: number;
      if (aPrice > bPrice) { res = 1; }
      else if (aPrice < bPrice) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.shownItems = newArray;
  }

  /**
   * Sorts the array by name
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : new sort type
   */
  async sortArrayByName(sortToUp: boolean, newSort: string): Promise<void> {
    this.setSelectedSorting(newSort);
    let newArray = this.items;
    newArray.sort( (a, b) => {
      let res: number;
      if (a.name > b.name) { res = 1; }
      else if (a.name < b.name) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.shownItems = newArray;
  }

  /**
   * Sorts the array by name
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : new sort type
   */
  async sortArrayByTime(sortToUp: boolean, newSort: string): Promise<void> {
    this.setSelectedSorting(newSort);
    let newArray = this.items;
    newArray.sort( (a, b) => {
      let res: number;
      if (a.block > b.block) { res = -1; }
      else if (a.block < b.block) { res = 1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    console.log(newArray);
    this.shownItems = newArray;
  }

}
