import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { getSalesHistoric } from 'src/app/constants/gqlQueries';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './sales-statistics.component.html',
  styleUrls: ['./sales-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SalesStatisticsComponent implements OnInit {
  salesQuery: any;
  salesQuerySubscription: any;
  skip: number = 0;
  first: number = 1000;
  allSales: any[] = [];
  allSalesByContract: any = { all: [] };
  dataLoaded = false;
  selectedTab: string = 'all';
  actualStatistics: any = {};

  displayedColumns: string[] = ['tokenId', 'nftSeller', 'buyPrice', 'valueOnBusd', 'buyer', 'block'];
  dataSource = new MatTableDataSource(this.allSalesByContract.all);

  constructor(
    private apollo: Apollo,
    private connectionService: ConnectionService
  ) {
    this.resetData();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Gets all sales
   */
  ngOnInit(): void {
    this.getData();
  }

  /**
   * Reset all data to 0
   */
  resetData(): void {
    this.actualStatistics = {
      totalSales: 0,
      nfts: {},
      totalMovedTokens: {
        gq: 0,
        busd: 0,
        bnb: 0
      },
      maxSale: {
        gq: 0,
        busd: 0,
        bnb: 0
      },
      averageSale: {
        gq: { counter: 0, allSaleSum: 0 },
        busd: { counter: 0, allSaleSum: 0 },
        bnb: { counter: 0, allSaleSum: 0 }
      }
    };
  }

  /**
   * Subscribe to query to get all the sales
   */
  async getData(): Promise<any> {
    if (this.salesQuerySubscription) { this.salesQuerySubscription.unsubscribe(); }
    this.salesQuery = this.apollo.use('marketplace').watchQuery({
      query: getSalesHistoric,
      pollInterval: 10000,
      variables: {
        skip: this.skip,
        first: this.first
      }
    });
    this.salesQuerySubscription = this.salesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log('Get sales data:');
        console.log(res.data.salesHistories);
        this.manageQueryData(res.data.salesHistories);
      });
  }

  /**
   * Manage the data get from the query (multiple querying)
   * @param frozenData data from query
   */
  manageQueryData(frozenData: any[]): void {
    let data = JSON.parse( JSON.stringify( frozenData ) );
    if (data.length > 0) {
      this.allSales = this.allSales.concat(data);
      this.skip += this.first;
      this.getData();
    } else {
      console.log('All done ' + this.allSales.length);
      this.processSalesData();
    }
  }

  /**
   * Process data
   */
  async processSalesData(): Promise<any> {
    this.allSales = await this.setPricesOnBUSD();
    this.dataSource = new MatTableDataSource(this.allSalesByContract.all);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setActualStatistic();
    this.dataLoaded = true;
  }

  /**
   * Set prices of NFTs on BUSD
   * @returns processed data
   */
  async setPricesOnBUSD(): Promise<any[]> {
    for (let nft of this.allSales) {
      if (nft.erc20Token.toLowerCase() === contractAddresses.busd.toLowerCase()) {
        nft.valueOnBusd = parseFloat(this.connectionService.fromWei(nft.buyPrice));
      } else if (nft.erc20Token.toLowerCase() === contractAddresses.gq.toLowerCase()) {
        nft.valueOnBusd = parseFloat(this.connectionService.fromWei(nft.buyPrice)) * gqPriceOnBusd[0];
      } else if (nft.erc20Token.toLowerCase() === contractAddresses.bnb.toLowerCase()) {
        nft.valueOnBusd = parseFloat(this.connectionService.fromWei(nft.buyPrice)) * bnbPriceOnBusd[0];
      }
      if (!this.allSalesByContract[nft.nftContractAddress]) {
        this.allSalesByContract[nft.nftContractAddress] = [];
      }
      this.allSalesByContract[nft.nftContractAddress].push(nft);
      this.allSalesByContract.all.push(nft);
    }
    console.log(this.allSalesByContract);
    return this.allSales;
  }

  /**
   * Sets the selected tab with given one
   * @param newTab tab to change to
   */
  setSelectedTab(newTab: string): void {
    this.selectedTab = newTab;
    this.dataSource = new MatTableDataSource(this.allSalesByContract[this.selectedTab]);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setActualStatistic();
  }

  /**
   * Set statistics
   */
  setActualStatistic(): void {
    this.resetData();
    for (let sale of this.allSalesByContract[this.selectedTab]) {
      this.actualStatistics.totalSales++;
      if (sale.erc20Token.toLowerCase() === contractAddresses.gq.toLowerCase()) { this.setDataForToken('gq', parseFloat(this.connectionService.fromWei(sale.buyPrice))); }
      else if (sale.erc20Token.toLowerCase() === contractAddresses.busd.toLowerCase()) { this.setDataForToken('busd', parseFloat(this.connectionService.fromWei(sale.buyPrice))); }
      else if (sale.erc20Token.toLowerCase() === contractAddresses.bnb.toLowerCase()) { this.setDataForToken('bnb', parseFloat(this.connectionService.fromWei(sale.buyPrice))); }
      if (!this.actualStatistics.nfts[sale.nftContractAddress]) {
        this.actualStatistics.nfts[sale.nftContractAddress] = 1;
      } else {
        this.actualStatistics.nfts[sale.nftContractAddress]++;
      }
    }
    console.log(this.actualStatistics);
  }

  /**
   * Set statistic data for given token
   * @param token nft contract address
   * @param buyPrice final price of the sale
   */
  setDataForToken(token: string, buyPrice: any): void {
    this.actualStatistics.totalMovedTokens[token] += buyPrice;
    if (buyPrice > this.actualStatistics.maxSale[token]) {
      this.actualStatistics.maxSale[token] = buyPrice;
    }
    this.actualStatistics.averageSale[token].counter++;
    this.actualStatistics.averageSale[token].allSaleSum += buyPrice;
  }

}
