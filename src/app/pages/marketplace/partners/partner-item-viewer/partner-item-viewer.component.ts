import { AfterViewInit, Component, DoCheck, Input, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { FilterService } from 'src/app/shared/services/filter.service';
import { partners } from 'src/app/constants/partnerships';

/**
 * Item viewer for Partners Marketplace
 */
@Component({
  selector: 'app-partner-item-viewer',
  templateUrl: './partner-item-viewer.component.html',
  styleUrls: ['./partner-item-viewer.component.scss']
})
export class PartnerItemViewerComponent implements OnInit, DoCheck, AfterViewInit {
  @Input() items: any[];
  @Input() category: string;
  @Input() title: string;
  categoryControl: string;
  iterableDiffer: any;
  filter: any;
  shownItems: any[];
  allFilters: string[] = [];
  activeFilters: Array<string>[] = [ [], [], [], [], []];
  totalItems: number;
  selectedSorting: string = 'Sorting';
  filterIsShowing: boolean = false;

  // Pagination
  displayedColumns = ['item'];
  pageSize = 6;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private iterableDiffers: IterableDiffers,
    private filterService: FilterService
  ) {
    this.iterableDiffer = this.iterableDiffers.find([]).create(undefined);
  }

  ngOnInit(): void {
  }

  /**
   * Set data to mat table datasource
   */
  ngAfterViewInit(): void {
    this.shownItems = this.items;
    this.setFilter();
    this.categoryControl = this.category;
    this.initializeTableDataSource(this.items);
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
   * Set data to mat table datasource
   * @param {any} data : data to show
   */
  initializeTableDataSource(data: any): void {
    if (data) {
      this.totalItems = data.length;
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Control changes on data
   */
  ngDoCheck(): void {
    if (!this.shownItems) {
      this.shownItems = this.items;
    }
    if (this.categoryControl !== this.category) {
      this.setFilter();
      this.categoryControl = this.category;
    }
    const changes = this.iterableDiffer.diff(this.items);
    if (changes) {
      this.totalItems = this.items.length;
      this.dataSource = new MatTableDataSource<any>(this.items);
      this.dataSource.paginator = this.paginator;
    }
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
  filterData(event: any, filterIndex: number): void {
    // Set filter
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
    let filteredItems = this.getFilteredArray();
    console.log(filteredItems);
    this.initializeTableDataSource(filteredItems);
  }

  /**
   * Filters the array
   * @returns {any} the array after filtering
   */
  getFilteredArray(): any {
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
      [contractAddresses.bnb]: bnbPriceOnBusd[0], // BNB
      [contractAddresses.busd]: 1, // BUSD
      [contractAddresses.gq]: gqPriceOnBusd[0]  // GQ
    };
    newArray.sort( (a, b) => {
      const aPrice = parseFloat(a.buyPrice) * pricesOnBusd[a.erc20Token.toLowerCase()];
      const bPrice = parseFloat(b.buyPrice) * pricesOnBusd[b.erc20Token.toLowerCase()];
      let res: number;
      if (aPrice > bPrice) { res = 1; }
      else if (aPrice < bPrice) { res = -1; }
      else { res = 0; }
      if (!sortToUp) { res = res * -1; }
      return res;
    });
    this.initializeTableDataSource(newArray);
  }

  /**
   * Sorts the array by name
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : new sort type
   */
  sortArrayByName(sortToUp: boolean, newSort: string): void {
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
    this.initializeTableDataSource(newArray);
  }

  /**
   * Sorts the array by name
   * @param {boolean} sortToUp : true asc, false desc
   * @param {string} newSort : new sort type
   */
  sortArrayByTime(sortToUp: boolean, newSort: string): void {
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
    this.initializeTableDataSource(newArray);
  }

}
