import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailApiService } from 'src/app/shared/services/email-api.service';
import { partners } from 'src/app/constants/partnerships';
import { getHotAuctions, getSales } from 'src/app/constants/gqlQueries';
import { Apollo, QueryRef } from 'apollo-angular';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';

/**
 * Home of the Marketplace Section
 */
@Component({
  selector: 'app-marketplace-home',
  templateUrl: './marketplace-home.component.html',
  styleUrls: ['./marketplace-home.component.scss']
})
export class MarketplaceHomeComponent implements OnInit, OnDestroy {
  queryQuantity = 8;
  email = '';
  emailError = false;
  emailSent = false;
  latestSales: Array<any> = [];
  hotBids: Array<any> = [];
  partners = partners;
  salesQuery: any;
  salesQuerySubscription: any;
  auctionsQuery: any;
  auctionsQuerySubscription: any;

  constructor(
    private emailApiService: EmailApiService,
    private apollo: Apollo,
    private utilsService: UtilsService
  ) { }

  /**
   * Gets last sales and hot auctions
   */
  ngOnInit(): void {
    this.getLastSales(this.queryQuantity);
    this.getHotAuctions(this.queryQuantity);
  }

  /**
   * Unsubscribe from all the queries
   */
  ngOnDestroy(): void {
    if (this.salesQuerySubscription) {
      this.salesQuerySubscription.unsubscribe();
    }
    if (this.auctionsQuerySubscription) {
      this.auctionsQuerySubscription.unsubscribe();
    }
  }

  /**
   * Subscribe to last sales query
   * @param {number} queryQuantity : The amount of results
   */
  async getLastSales(queryQuantity: number): Promise<void> {
    this.salesQuery = this.apollo.use('marketplace').watchQuery({
      query: getSales,
      pollInterval: 500,
      variables: {
        amount: queryQuantity,
        // DOWHEN: New OR NFT added, add it's address to the next array
        nftContractAddress: [contractAddresses.armor, contractAddresses.clanBadge, contractAddresses.cosmetic, contractAddresses.exocredit, contractAddresses.landVehicle, contractAddresses.spaceVehicle, contractAddresses.weapon, contractAddresses.land, contractAddresses.holdtelKey]
      }
    });
    this.salesQuerySubscription = this.salesQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.sales);
        console.log('Get sales data:');
        console.log(res);
        this.latestSales = res;
      });
  }

  /**
   * Subscribe to hot auctions query
   * @param {number} queryQuantity : The amount of results
   */
  async getHotAuctions(queryQuantity: number): Promise<void> {
    const now = Math.round(Date.now() / 1000).toString();
    this.auctionsQuery = this.apollo.use('marketplace').watchQuery({
      query: getHotAuctions,
      pollInterval: 500,
      variables: {
        amount: queryQuantity,
        actualTimeStamp: now
      }
    });
    this.auctionsQuerySubscription = this.auctionsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        res = await this.utilsService.parseMetadata(res.data.auctions);
        console.log('Get auctions data:');
        console.log(res);
        this.hotBids = res;
      });
  }

  /**
   * Submit email to newsletter subscription
   */
  submitEmail(): any {
    if (this.validateEmail()) {
      this.subscribeToNewsletter();
    } else {
      this.emailSent = false;
      this.emailError = true;
    }
  }

  /**
   * Subscribe email to newsletter
   */
  subscribeToNewsletter(): void {
    if (this.validateEmail()) {
      this.emailApiService.subscribeToNewsletter(this.email)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.result === 'success') {
            this.emailSent = true;
            this.email = '';
          }
        },
        (err: any) => {
          console.log(err);
      });
    } else {
      this.emailSent = false;
      this.emailError = true;
    }
  }

  /**
   * Validates email format with a regular expresion
   * @returns true if email is correct
   */
  validateEmail(): any {
    const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(this.email);
  }

  /**
   * Delete the messages after interaction
   */
  deleteMessage(): void {
    this.emailSent = false;
    this.emailError = false;
  }

}
