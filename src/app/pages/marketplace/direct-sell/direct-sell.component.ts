import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { getSales } from 'src/app/constants/gqlQueries';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { UtilsService } from 'src/app/shared/services/utils.service';

/**
 * Sales section of the marketplace
 */
@Component({
  selector: 'app-direct-sell',
  templateUrl: './direct-sell.component.html',
  styleUrls: ['./direct-sell.component.scss']
})
export class DirectSellComponent implements OnInit, OnDestroy {
  nftOnSale: Array<any>;
  selectedCategory = 'All';
  salesQuery: any;
  salesQuerySubscription: any;
  loadingData: boolean = false;
  // DOWHEN: New OR NFT added, add it's address to the next object, in all and create field in last place
  addressesForQuery: {[index: string]:any} = {
    all: [contractAddresses.armor, contractAddresses.clanBadge, contractAddresses.cosmetic, contractAddresses.exocredit, contractAddresses.landVehicle, contractAddresses.spaceVehicle, contractAddresses.weapon, contractAddresses.land, contractAddresses.holdtelKey],
    armors: [contractAddresses.armor],
    clan: [contractAddresses.clanBadge],
    cosmetics: [contractAddresses.cosmetic],
    exo: [contractAddresses.exocredit],
    vehicles: [contractAddresses.landVehicle, contractAddresses.spaceVehicle],
    weapons: [contractAddresses.weapon],
    lands: [contractAddresses.land],
    keys: [contractAddresses.holdtelKey]
  }

  constructor(
    private apollo: Apollo,
    private utilsService: UtilsService
  ) { }

  /**
   * Gets all sales
   */
  ngOnInit(): void {
    this.getSalesData();
  }

  /**
   * Unsubscribe if subscription exist
   */
  ngOnDestroy(): void {
    if (this.salesQuerySubscription) {
      this.salesQuerySubscription.unsubscribe();
    }
  }

  /**
   * Subscribe to query to get all the sales
   */
  async getSalesData(): Promise<any> {
    if (this.salesQuerySubscription) { this.salesQuerySubscription.unsubscribe(); }
    this.loadingData = true;
    this.salesQuery = this.apollo.use('marketplace').watchQuery({
      query: getSales,
      pollInterval: 500,
      variables: {
        amount: 1000,
        nftContractAddress: this.addressesForQuery[this.selectedCategory.toLowerCase()]
      }
    });
    this.salesQuerySubscription = this.salesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.sales);
        this.nftOnSale = res;
        console.log('Get sales data:');
        console.log(res);
        this.loadingData = false;
      });
  }

  /**
   * Change selected main category
   * @param {string} cat : Selected new category
   */
  async changeCategory(cat: string): Promise<void> {
    this.selectedCategory = cat;
    this.getSalesData();
  }

}
