import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AllFilter, OrArmorFilter, OrClanFilter, OrCosmeticFilter, OrExoFilter, OrKeyFilter, OrLandFilter, OrVehicleFilter, OrWeaponFilter } from 'src/app/constants/filters';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { contractAddresses } from 'src/app/constants/contractAddresses';

/**
 * Item viewer for marketplace NFTs
 */
@Component({
  selector: 'app-item-viewer-big',
  templateUrl: './item-viewer-big.component.html',
  styleUrls: ['./item-viewer-big.component.scss']
})
export class ItemViewerBigComponent implements OnInit, OnChanges {
  @Input() items: any[];
  @Input() category: string;
  @Input() type: string;
  @Input() fullSorting: boolean;
  @Input() showMainCategory: boolean;
  filter: any;
  filteredAuctionItems: any[] = [];
  filteredItems: any[] = [];
  allFilters: string[] = [];
  activeFilters: Array<string>[] = [[], [], [], [], [], [], [], []];
  totalItems: number;
  hiddenItems: number;
  selectedSorting: string = 'Sorting';
  filterIsShowing: boolean = false;
  showEndedAuctions: boolean = true;
  filteringData: boolean = false;
  now: number;
  // Pagination
  pagItemPerPage: number = 6;
  pagActualPage: number = 0;
  pagTotalPages: number = 1;

  constructor() {
    this.now = Math.round(Date.now() / 1000);
  }

  ngOnInit(): void {
    this.filteredItems = this.items;
    this.totalItems = this.filteredItems.length;
    this.setFilter();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<any> {
    if (changes.category) {
      this.allFilters = [];
      this.activeFilters = [ [], [], [], [], [], [], [], []];
    }
    this.filteredItems = [];
    this.filteredItems = await this.getFilteredArray();
    this.sortData();
    this.manageDataForView();
    this.setFilter();
  }

  /**
   * Set the total page amount
   */
  setPagination(array: any[]): void {
    this.pagTotalPages = Math.ceil(array.length / this.pagItemPerPage) - 1;
    this.goToFirstOrLastPage(true);
  }

  /**
   * Changes the page on the pagination
   * @param isNext true for next, false for previous
   */
  changePage(isNext: boolean): void {
    let movement = 1;
    if (!isNext) { movement = -1; }
    this.pagActualPage += movement;
  }

  /**
   * Go to first or last page on pagination
   * @param toFirst true to first, false to last
   */
  goToFirstOrLastPage(toFirst: boolean): void {
    if (toFirst) {
      this.pagActualPage = 0;
    } else {
      this.pagActualPage = this.pagTotalPages;
    }
  }

  /**
   * Manage data to show on view
   * @param data : data to show on viewer
   */
  manageDataForView(): void {
    try {
      this.setPagination(this.filteredItems);
      this.now = Math.round(Date.now() / 1000);
      this.totalItems = this.filteredItems.length;
      this.hiddenItems = this.filteredItems.filter( (item: any) => item.endTimeStamp < this.now).length;
      this.hideOrShowAuctions();
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Switch to show ended auctions
   * @param modifyBoolean: true to show false to hide
   */
  async switchAuctions(modifyBoolean: boolean): Promise<void> {
    if (modifyBoolean) {this.showEndedAuctions = !this.showEndedAuctions; }
    this.now = Math.round(Date.now() / 1000);
    this.manageDataForView();
  }

  hideOrShowAuctions(): void {
    if (this.type === 'auction') {
      if (!this.showEndedAuctions) {
        this.filteredAuctionItems = this.filteredItems.filter( (item: any) => item.endTimeStamp > this.now);
        this.setPagination(this.filteredAuctionItems);
        this.totalItems = this.filteredAuctionItems.length;
      } else {
        this.filteredAuctionItems = this.filteredItems;
        this.setPagination(this.filteredAuctionItems);
        this.totalItems = this.filteredAuctionItems.length;
      }
    }
  }

  /**
   * Sets filter
   */
  setFilter(): void {
    // this.allFilters = [];
    // this.activeFilters = [ [], [], [], [], [], [], [], []];
    switch (this.category.toLowerCase()) {
      case 'all': this.filter = AllFilter; break;
      case 'weapons': this.filter = OrWeaponFilter; break;
      case 'armors': this.filter = OrArmorFilter; break;
      case 'vehicles': this.filter = OrVehicleFilter; break;
      case 'cosmetics': this.filter = OrCosmeticFilter; break;
      case 'clan': this.filter = OrClanFilter; break;
      case 'exo': this.filter = OrExoFilter; break;
      case 'lands': this.filter = OrLandFilter; break;
      case 'keys': this.filter = OrKeyFilter; break;
      default: this.filter = AllFilter; break;
    }
  }

  /**
   * Open and close clicked filter
   * @param {string} id : Element id to change class
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
   * @param {any} event : Click event
   * @param {number} filterIndex : The index of the filter
   */
  async filterData(event: any, filterIndex: number): Promise<void> {
    if (!this.filteringData) {
      this.filteringData = true;
      document.getElementById(event.target.id)?.classList.toggle('active');
      if (this.activeFilters[filterIndex].includes(event.target.id)) {
        this.activeFilters[filterIndex].splice(this.activeFilters[filterIndex].indexOf(event.target.id), 1);
      } else {
        this.activeFilters[filterIndex].push(event.target.id);
      }

      if (this.allFilters.includes(event.target.id)) {
        this.allFilters.splice(this.activeFilters.indexOf(event.target.id), 1);
      } else {
        this.allFilters.push(event.target.id);
      }
      // Filter array
      this.filteredItems = [];
      this.filteredItems = await this.getFilteredArray();
      console.log(this.filteredItems);
      this.manageDataForView();
      this.filteringData = false;
    }
  }

  /**
   * Get Array once filters are applied
   * @returns {any} : Array after filtering
   */
  async getFilteredArray(): Promise<any> {
    let controlArray = this.items;
    if (this.allFilters.length > 0) {
      for (const activef of this.activeFilters){
        let auxArray = [];
        if (activef.length > 0) {
          for (const f of activef) {
            let aux2Array = controlArray.filter( i =>  Object.values(i).includes(f) || Object.values(i.attributes).includes(f) );
            for (const x of aux2Array) {
              auxArray.push(x);
            }
          }
          controlArray = [];
          controlArray = auxArray;
        }
      }
    } else {
      controlArray = this.items;
    }
    return controlArray;
  }

  /**
   * Functions to sort shown items
   * @param {string} newSort : Selected sorting type
   */
  setSelectedSorting(newSort: string): void {
    if (newSort === this.selectedSorting) {
      this.selectedSorting = 'Sorting';
    } else {
      this.selectedSorting = newSort;
    }
  }

  async sortData(): Promise<any> {
    switch (this.selectedSorting) {
      case 'Price Up': this.sortArrayByPrice(true, 'Price Up'); break;
      case 'Price Down': this.sortArrayByPrice(false, 'Price Down'); break;
      case 'Tier Up': this.sortArrayByTier(true, 'Tier Up'); break;
      case 'Tier Down': this.sortArrayByTier(false, 'Tier Down'); break;
      case 'Name A-Z': this.sortArrayByName(true, 'Name A-Z'); break;
      case 'Name Z-A': this.sortArrayByName(false, 'Name Z-A'); break;
      case 'Newest': this.sortArrayByTime(true, 'Newest'); break;
      case 'Oldest': this.sortArrayByTime(false, 'Oldest'); break;
    }
  }

  /**
   * Sorts array by price
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : sorting type
   */
  async sortArrayByPrice(sortToUp: boolean, newSort: string): Promise<void> {
    this.setSelectedSorting(newSort);
    const pricesOnBusd = {
      [contractAddresses.bnb.toLowerCase()]: bnbPriceOnBusd[0], // BNB
      [contractAddresses.busd.toLowerCase()]: 1, // BUSD
      [contractAddresses.gq.toLowerCase()]: gqPriceOnBusd[0]  // GQ
    };
    if (this.type === 'sale') {
      this.filteredItems = this.sortSaleArrayByPrice(sortToUp, this.filteredItems, pricesOnBusd);
    } else if (this.type === 'auction') {
      this.filteredItems = this.sortAuctionArrayByPrice(sortToUp, this.filteredItems, pricesOnBusd);
    }
    this.manageDataForView();
  }

  /**
   * Sorts Sale array by price
   * @param {boolean} sortToUp : true asc, false desc
   * @param {Array} array : array to sort
   * @param {any} pricesOnBusd : prices converted to busd
   * @returns {Array} : sorted array
   */
  sortSaleArrayByPrice(sortToUp: boolean, array: Array<any>, pricesOnBusd: any): Array<any> {
    return array.sort( (a, b) => {
      const aPrice = parseFloat(a.buyPrice) * pricesOnBusd[a.erc20Token.toLowerCase()];
      const bPrice = parseFloat(b.buyPrice) * pricesOnBusd[b.erc20Token.toLowerCase()];
      let res: number;
      if (aPrice > bPrice) { res = 1; }
      else if (aPrice < bPrice) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
  }

  /**
   * Sorts Auction array by price
   * @param {boolean} sortToUp : true asc, false desc
   * @param {Array} array : array to sort
   * @param {any} pricesOnBusd : prices converted to busd
   * @returns {Array} : sorted array
   */
  sortAuctionArrayByPrice(sortToUp: boolean, array: Array<any>, pricesOnBusd: any): Array<any> {
    return array.sort( (a, b) => {
      a.sortPrice = a.minPrice / 1000000000000000000;
      b.sortPrice = b.minPrice / 1000000000000000000;
      if (a.bidsMade !== '0'){
        a.sortPrice = a.nftHighestBid / 1000000000000000000;
      }
      if (b.bidsMade !== '0'){
        b.sortPrice = b.nftHighestBid / 1000000000000000000;
      }
      a.sortPrice = parseFloat(a.sortPrice) * pricesOnBusd[a.erc20Token.toLowerCase()];
      b.sortPrice = parseFloat(b.sortPrice) * pricesOnBusd[b.erc20Token.toLowerCase()];
      let res: number;
      if (a.sortPrice > b.sortPrice) { res = 1; }
      else if (a.sortPrice < b.sortPrice) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
  }

  /**
   * Sorts array by name
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : sorting type
   */
  sortArrayByName(sortToUp: boolean, newSort: string): void {
    this.setSelectedSorting(newSort);
    this.filteredItems = this.filteredItems.sort( (a, b) => {
      let res: number;
      if (a.name > b.name) { res = 1; }
      else if (a.name < b.name) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.manageDataForView();
  }

  /**
   * Sorts array by time
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : sorting type
   */
  sortArrayByTime(sortToUp: boolean, newSort: string): void {
    this.setSelectedSorting(newSort);
    this.filteredItems = this.filteredItems.sort( (a, b) => {
      let res: number;
      if (a.block > b.block) { res = -1; }
      else if (a.block < b.block) { res = 1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.manageDataForView();
  }

  /**
   * Sorts array by tier
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : sorting type
   */
  sortArrayByTier(sortToUp: boolean, newSort: string): void {
    this.setSelectedSorting(newSort);
    this.filteredItems.sort( (a, b) => {
      if (!a.tier) { a.tier = 'NoTier'; }
      if (!b.tier) { b.tier = 'NoTier'; }
      let res: number;
      if (a.tier > b.tier) { res = 1; }
      else if (a.tier < b.tier) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.manageDataForView();
  }
}
