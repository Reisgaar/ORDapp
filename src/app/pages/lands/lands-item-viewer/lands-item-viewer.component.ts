import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subject, Subscription } from 'rxjs';
import { getLandsOnAuction, getWalletLandWhitelist } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { FilterService } from 'src/app/shared/services/filter.service';

/**
 * Viewer for the lands auctions
 */
@Component({
  selector: 'app-lands-item-viewer',
  templateUrl: './lands-item-viewer.component.html',
  styleUrls: ['./lands-item-viewer.component.scss']
})
export class LandsItemViewerComponent implements OnInit, OnDestroy {
  @Input() display: string;
  @Input('clickFilter') clickSubject: Subject<any>;
  @Output() newFilterEvent = new EventEmitter<any>();
  nfts: any[] = [];
  shownNfts: any[] = [];
  walletInterval: any;
  userWhitelist: {[index: string]:any} = {
    nano: { whitelisted: true,  tokenId: 0,    nftContractAddress: '' },
    micro: { whitelisted: true, tokenId: 0, nftContractAddress: '' },
    standard: { whitelisted: true, tokenId: 0, nftContractAddress: '' },
    macro: { whitelisted: true, tokenId: 0, nftContractAddress: '' },
    mega: { whitelisted: true, tokenId: 0, nftContractAddress: '' }
  };
  landsLoaded: boolean = false;
  // Queries
  landFiltersForQuery: Array<string> = [];
  landsQuery: any;
  landsQuerySubscription: any;
  walletQuery: any;
  nftQuerySubscription: any;
  // Filtering
  landFiltersSubscription: Subscription;
  landFilters: {[index: string]:any} =  {
    zone: { ring: '', sector: '', district: ''},
    sizes: { nano: true, micro: true, standard: true, macro: true, mega: true }
  };
  // Sorting
  landQueryOrderOptions = ['startTimeStamp', 'endTimeStamp', 'nftHighestBid', 'ring', 'counter'];
  landQueryOrder: string = 'startTimeStamp';
  orderDirectionIsAsc: boolean = false;
  orderDirection: string = 'asc';
  // For visibility switcher
  showEnded: boolean = true;
  showComming: boolean = true;
  showOnlyUserBids: boolean = false;
  // Pagination
  actualPage: number = 1;
  pageSize: number = 12;
  maxPage: number;

  constructor(
    private connectionService: ConnectionService,
    private filterService: FilterService,
    private apollo: Apollo
  ) { }

  /**
   * Get user address and check bid whitelist
   * Subscribe to filter and sorting changes
   */
  ngOnInit(): void {
    this.newFilterEvent.emit({order: this.landQueryOrder, direction: this.orderDirection});
    this.walletInterval = setInterval( async () => {
      try {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.checkWhereUserCanBid(userAddress);
        clearInterval(this.walletInterval);
      } catch (error: any) { }
    }, 1000);
    // Subscribe to filter changes
    this.landFiltersSubscription = this.filterService.landFilters$.subscribe( (res: any) => {
      this.landFilters = res;
      this.setLandFiltersForQuery();
      console.log(this.landFilters);
    });
    // Subscribe to sorting changes
    this.clickSubject.subscribe( () => {
      this.setSortingForLandQuery();
    });
    this.getLandsOnAuction();
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    if (this.landsQuerySubscription) { this.landsQuerySubscription.unsubscribe(); }
    if (this.nftQuerySubscription) { this.nftQuerySubscription.unsubscribe(); }
    if (this.landFiltersSubscription) { this.landFiltersSubscription.unsubscribe(); }
  }

  /**
   * Prepares the data for lands query
   */
  async getLandsOnAuction(): Promise<any> {
    // Unsubscribe is neccesary to work with filters. Using refetch() didn't work, always returns cached result
    if (this.landsQuerySubscription) { await this.landsQuerySubscription.unsubscribe(); }
    // Get wallet if only bids shown
    let userAddress: any[] = [];
    if (this.showOnlyUserBids) {
      try {
        const user = this.connectionService.getWalletAddress().toLowerCase();
        userAddress = [user.toLowerCase()];
      } catch (error: any) {
        userAddress = [];
      }
    }
    // Set and subscribe to query
    this.setAndSubscribeQuery(userAddress);
  }

  /**
   * Subscribes to the lands query
   * @param userAddress the wallet of the user
   */
  setAndSubscribeQuery(userAddress: Array<string>): any {
    this.landsQuery = this.apollo.use('lands').watchQuery({
      query: getLandsOnAuction,
      pollInterval: 5000,
      variables: {
        orderDirection: this.orderDirection,
        orderBy: this.landQueryOrder,
        size: this.landFiltersForQuery,
        ring: this.landFilters['zone'].ring,
        sector: this.landFilters['zone'].sector,
        district: this.landFilters['zone'].district,
        wallet: userAddress
      }
    });
    this.landsQuerySubscription = this.landsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log(res);
        this.nfts = res.data.lands;
        this.setArrayWithPagination();
        console.log('Lands Query:');
        console.log(this.nfts);
        this.landsLoaded = true;
      });
  }

  /**
   * Gets the ring on string
   * @param data ring name from metadata
   * @returns string with ring number
   */
  getRingString(data: number): string {
    switch (data) {
      case 0: return '';
      case 1: return '1';
      case 2: return '2';
      case 3: return '3';
      case 4: return '4';
      default: return '0';
    }
  }


  /**
   * Checks the lands where a user can bid
   * @param userAddr wallet of the user
   */
  checkWhereUserCanBid(userAddr: string): void {
    // userAddr = userAddr.toLowerCase();
    // this.walletQuery = this.apollo.use('marketplace').watchQuery({
    //   query: getWalletLandWhitelist,
    //   pollInterval: 3000,
    //   variables: {
    //     wallet: userAddr
    //   }
    // });
    // this.nftQuerySubscription = this.walletQuery
    //   .valueChanges
    //   .subscribe( async (res: any) => {
    //     res = res.data.inventory[0];
    //     if (res) {
    //       console.log(res);
    //       this.setUserWhitelist(res);
    //     }
    //   });
  }

  /**
   * Sets the data of user whitelist query
   * @param data data from the query
   */
  async setUserWhitelist(data: any): Promise<any> {
    // for (const item in data) {
    //   if (data[item].length > 0) {
    //     let size = item.toLowerCase();
    //     if (item === 'standard1' || item === 'standard2') { size = 'standard'; }
    //     if (size === 'nano' || size === 'micro' || size === 'standard' || size === 'macro' || size === 'mega') {
    //       this.userWhitelist[size].whitelisted = true;
    //       this.userWhitelist[size].tokenId = parseInt(data[item][0].id, 16);
    //       this.userWhitelist[size].nftContractAddress = data[item][0].nftContractAddress;
    //     }
    //   }
    // }
    // console.log('User Whitelist:');
    // console.log(this.userWhitelist);
  }

  /**
   * Set the filters for the query and update it
   */
  setLandFiltersForQuery(): void {
    // sizes
    let actualSelectedSizes = [];
    for (const filter in this.landFilters['sizes']) {
      if (this.landFilters['sizes'][filter]) {
        actualSelectedSizes.push(this.capitalizeFirstLetter(filter));
      }
    }
    this.landFiltersForQuery = actualSelectedSizes;
    // update query
    this.getLandsOnAuction();
  }

  /**
   * Capitalize the first letter of a string
   * @param data a string to convert
   * @returns the string procesed
   */
  capitalizeFirstLetter(data: string): string {
    return data.charAt(0).toUpperCase() + data.slice(1);
  }


  /**
   * Sets the sorting for the query and updates it
   */
  setSortingForLandQuery(): void {
    if (this.orderDirectionIsAsc) {
      this.orderDirectionIsAsc = false;
      this.orderDirection = 'desc';
    } else {
      // set order category
      this.orderDirection = 'asc';
      this.orderDirectionIsAsc = true;
      const index = this.landQueryOrderOptions.indexOf(this.landQueryOrder);
      if (this.landQueryOrderOptions[index + 1]) {
        this.landQueryOrder = this.landQueryOrderOptions[index + 1];
      } else {
        this.landQueryOrder = this.landQueryOrderOptions[0];
      }
    }
    // update query and send data to parent
    this.getLandsOnAuction();
    this.newFilterEvent.emit({order: this.landQueryOrder, direction: this.orderDirection});
  }

  /**
   * Switches the visibility of ended auctions
   */
  switchEndedVisibility(): void {
    this.showEnded = !this.showEnded;
    this.setArrayWithPagination();
  }

  /**
   * Switches the visibility of comming auctions
   */
  switchCommingVisibility(): void {
    this.showComming = !this.showComming;
    this.setArrayWithPagination();
  }

  /**
   * Shows only the bids done by the user
   */
  switchMyBidsVisibility(): void {
    this.showOnlyUserBids = !this.showOnlyUserBids;
    this.getLandsOnAuction();
  }

  /**
   * Sets the array according to pagination
   */
  async setArrayWithPagination(): Promise<void> {
    const realArray = await this.getNftsConsideringVisibility();
    if (realArray.length < this.pageSize) { this.pageSize = 8; }
    this.maxPage = Math.ceil(realArray.length / this.pageSize);
    if (this.actualPage > this.maxPage || this.actualPage === 0) { this.actualPage = this.maxPage; }
    if (this.actualPage === 0) { this.actualPage = 1; }
    const start = (this.actualPage - 1) * this.pageSize;
    const end = this.actualPage * this.pageSize;
    this.shownNfts = realArray.slice(start, end);
  }

  /**
   * Gets the array with selected visibility options
   * @returns processed array
   */
  async getNftsConsideringVisibility(): Promise<Array<any>> {
    let newArray = [];
    const now = Date.now() / 1000;
    if (!this.showComming && !this.showEnded) {
      newArray = this.nfts.filter( (nft: any) => parseInt(nft.startTimeStamp, 0) < now && parseInt(nft.endTimeStamp, 0) > now);
    } else if (!this.showComming && this.showEnded) {
      newArray = this.nfts.filter( (nft: any) => parseInt(nft.startTimeStamp, 0) < now);
    } else if (this.showComming && !this.showEnded) {
      newArray = this.nfts.filter( (nft: any) => parseInt(nft.endTimeStamp, 0) > now);
    } else {
      newArray = this.nfts;
    }
    return newArray;
  }

  /**
   * Changes the page of the pagination
   * @param isNext true if is next page, false if is previous
   */
  changePage(isNext: boolean): void {
    if (isNext && (this.actualPage + 1) <= this.maxPage) {
      this.actualPage++;
    } else if (isNext && (this.actualPage + 1) > this.maxPage) {
      this.actualPage = 1;
    } else if (!isNext && (this.actualPage - 1) >= 1) {
      this.actualPage--;
    } else {
      this.actualPage = this.maxPage;
    }
    this.setArrayWithPagination();
  }

  /**
   * Moves pagination to indicated page
   * @param toPage page to move to
   */
  goToPage(toPage: number): void {
    this.actualPage = toPage;
    this.setArrayWithPagination();
  }

  /**
   * Changes the size of the page
   * @param size the new size
   */
  changePageSize(size: number): void {
    this.pageSize = size;
    this.setArrayWithPagination();
  }
}
