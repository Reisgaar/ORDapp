import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { getAuctions } from 'src/app/constants/gqlQueries';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { UtilsService } from 'src/app/shared/services/utils.service';

/**
 * Auctions section of the marketplace
 */
@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})
export class AuctionsComponent implements OnInit, OnDestroy {
  nftOnAuction: Array<any>;
  selectedCategory = 'All';
  auctionsQuery: any;
  auctionsQuerySubscription: any;
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
   * Gets all auctions
   */
  ngOnInit(): void {
    this.getAuctionsData();
  }

  /**
   * Unsubscribe if subscription exist
   */
  ngOnDestroy(): void {
    if (this.auctionsQuerySubscription) { this.auctionsQuerySubscription.unsubscribe(); }
  }

  /**
   * Subscribe to query to get all the auctions
   */
  async getAuctionsData(): Promise<any> {
    if (this.auctionsQuerySubscription) { this.auctionsQuerySubscription.unsubscribe(); }
    this.loadingData = true;
    this.auctionsQuery = this.apollo.use('marketplace').watchQuery({
      query: getAuctions,
      pollInterval: 500,
      variables: {
        amount: 1000,
        nftContractAddress: this.addressesForQuery[this.selectedCategory.toLowerCase()]
      }
    });
    this.auctionsQuerySubscription = this.auctionsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.auctions);
        this.nftOnAuction = res;
        console.log('Get auctions data:');
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
    this.getAuctionsData();
  }

}
