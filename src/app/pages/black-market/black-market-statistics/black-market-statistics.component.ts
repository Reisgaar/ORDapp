import { Component, OnDestroy, OnInit } from '@angular/core';
import { getBlackMarketFinishedSales } from 'src/app/constants/gqlQueries';
import { Apollo } from 'apollo-angular';
import { ConnectionService } from '../../../shared/services/connection/connection.service';

@Component({
  selector: 'app-black-market-statistics',
  templateUrl: './black-market-statistics.component.html',
  styleUrls: ['./black-market-statistics.component.scss']
})
export class BlackMarketStatisticsComponent implements OnInit, OnDestroy {
  nftsQuery: any;
  querySubscription: any;
  finishedSales: number = 0;
  movedGQ: number = 0;
  movedMaterials: number = 0;
  dataIsProcessed: boolean = false;
  sales: any[] = [];
  first: number = 1000;
  skip: number = 0;
  counter: number = 1;

  constructor(
    private apollo: Apollo,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    this.getFinishedSales();
  }

  /**
   * Ends intervals if exist
   */
  ngOnDestroy(): void {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Get wallet owned NFTs
   * @param userAddress addres of the user
   */
  getFinishedSales(): void {
    this.nftsQuery = this.apollo.use('blackMarket').watchQuery({
      query: getBlackMarketFinishedSales,
      variables: {
        first: this.first,
        skip: this.skip
      }
    });
    this.querySubscription = this.nftsQuery
      .valueChanges
      .subscribe( (res: any) => {
        if (this.querySubscription) { this.querySubscription.unsubscribe(); }
        console.log(this.counter)
        this.counter++;
        this.setArray(res.data.sales);
      });
    }

  setArray(data: any[]): void {
    this.sales = this.sales.concat(data);
    if (data.length < this.first) {
      this.processData();
    }
    else {
      this.skip += this.first;
      this.getFinishedSales();
    }
  }

  processData(): void {
    console.log('Finished sales:');
    console.log(this.sales);
    for (let sale of this.sales) {
      this.movedGQ += parseFloat(this.connectionService.fromWei(sale.price));
      this.movedMaterials += parseFloat(this.connectionService.fromWei(sale.quantity));
    }
    this.finishedSales = this.sales.length;
    this.dataIsProcessed = true;
  }

}
