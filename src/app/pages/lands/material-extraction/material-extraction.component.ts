import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { getWalletLandsBySize } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-material-extraction',
  templateUrl: './material-extraction.component.html',
  styleUrls: ['./material-extraction.component.scss']
})
export class MaterialExtractionComponent implements OnInit {
  landsQuery: any;
  landsQuerySubscription: any;
  walletIsConnected: boolean = false;
  userLands: any = { nano: [], micro: [], standard: [], macro: [], mega: []};

  constructor(
    private connectionService: ConnectionService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getLandsOnSector(userAddress);
      } else {
        if (this.landsQuerySubscription) { this.landsQuerySubscription.unsubscribe(); }
      }
    });
  }

  /**
   * Get all the lands of selected zone
   */
  async getLandsOnSector(userAddress: string): Promise<any> {
    this.landsQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletLandsBySize,
      pollInterval: 5000,
      variables: {
        wallet: userAddress
      }
    });
    this.landsQuerySubscription = this.landsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        if (res.data.lands.length > 0) {
          this.userLands = {
            nano: res.data.lands[0].nano,
            micro: res.data.lands[0].micro,
            standard: res.data.lands[0].standard,
            macro: res.data.lands[0].macro,
            mega: res.data.lands[0].mega
          };
        }
      });

  }
}
