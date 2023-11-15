import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { minerals } from 'src/app/constants/craftingData';
import { getBlackMarketSales } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-black-market',
  templateUrl: './black-market.component.html',
  styleUrls: ['./black-market.component.scss']
})
export class BlackMarketComponent implements OnInit, OnDestroy {
  blackMarketQuery: any;
  querySubscription: any;
  materials = minerals;
  selectedFilter: string = '';
  materialAddresses = [contractAddresses.acetylene, contractAddresses.aluminium, contractAddresses.argon, contractAddresses.carbon, contractAddresses.chromium, contractAddresses.cobalt, contractAddresses.copper, contractAddresses.helium, contractAddresses.hydrogen, contractAddresses.iron, contractAddresses.methane, contractAddresses.nickel, contractAddresses.oxygen, contractAddresses.plutonium, contractAddresses.silicon, contractAddresses.vanadium];
  materialSales: any[] = [];
  selectedTab: number = 0;
  possibleOrders = ['id', 'quantity', 'price'];
  selectedOrder: number = 0;
  orderDirection: string = 'desc';
  walletIsConnected: boolean = false;
  userAddress: string = "";
  // Pagination
  matsPerPage: number = 12;
  paginationPage: number = 0;
  totalPages: number = 1;
  salesAreLoaded: boolean = false;;

  constructor(
    private connectionService: ConnectionService,
    private apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        this.userAddress = this.connectionService.getWalletAddress().toLowerCase();
      } else {
        this.userAddress = "";
      }
      this.getBlackMarketSales();
    });
    console.log(this.materials);
  }

  /**
   * Ends intervals if exist and unsubscribe from query
   */
  ngOnDestroy(): void {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Subscribes to query to get black market sales
   */
  async getBlackMarketSales(): Promise<any> {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
    const matAdd = this.selectedFilter === '' ? this.materialAddresses : [contractAddresses[this.selectedFilter.toLowerCase()]];
    const ownerNot = this.selectedTab === 0 ? this.userAddress : '';
    const ownerContains = this.selectedTab === 1 ? this.userAddress : '';
    this.blackMarketQuery = this.apollo.use('blackMarket').watchQuery({
      query: getBlackMarketSales,
      pollInterval: 5000,
      variables: {
        materialAddresses: matAdd,
        orderBy: this.possibleOrders[this.selectedOrder],
        orderDirection: this.orderDirection,
        ownerContains,
        ownerNot
      }
    });
    this.querySubscription = this.blackMarketQuery
      .valueChanges
      .subscribe( res => {
        console.log('BM Sales:');
        console.log(res.data.sales);
        this.materialSales = res.data.sales;
        this.setTotalPages();
        this.salesAreLoaded = true;
      });
  }

  /**
   * Sets the selected filter to the given one
   * @param filter filter to set as selected
   */
  setSelectedFilter(filter: string): void {
    this.selectedFilter = filter;
    this.getBlackMarketSales();
  }

  /**
   * Sets the selected tab to the given one
   * @param filter tab to set as selected
   */
  setSelectedTab(newTab: number): void {
    this.selectedTab = newTab;
    this.getBlackMarketSales();
  }

  /**
   * Function to manage the query order changes
   */
  changeQueryOrder(): void {
    if (this.orderDirection === 'desc') {
      this.orderDirection = 'asc';
    } else {
      this.orderDirection = 'desc';
      this.selectedOrder = this.selectedOrder === (this.possibleOrders.length - 1) ? 0 : (this.selectedOrder + 1);
    }
    this.getBlackMarketSales();
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
    this.totalPages = Math.ceil(this.materialSales.length / this.matsPerPage) - 1;
  }

  /**
   * Sets the item amount to show on pagination
   * @param itemAmount item amount to set
   */
  setItemsPerPage(itemAmount: number): void {
    this.matsPerPage = itemAmount;
    this.setTotalPages();
  }
}
