import { Component, Input, OnDestroy, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { getUserKeys } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { HoldtelService } from 'src/app/shared/services/holdtel/holdtel.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-keyring',
  templateUrl: './keyring.component.html',
  styleUrls: ['./keyring.component.scss']
})
export class KeyringComponent implements OnInit, OnChanges, OnDestroy {
  holdtelKeys: any[];
  preAlphaKeys: any[];
  userHasKeys: boolean = false;
  loadingKeysData: boolean = true;
  interval: any;
  @Input() wallet: string;
  claimData: any = { isInWhitelist: false, size: null, merkleProof: null };
  keysQuery: any;
  querySubscription: any;

  constructor(
    private holdtelService: HoldtelService,
    private connectionService: ConnectionService,
    private apollo: Apollo,
    private utilsService: UtilsService
  ) {}

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getHoldtelClaimData();
    this.getUserKeys();
    this.interval = setInterval(() => {
      this.getHoldtelClaimData();
    }, 2000);

  }

  /**
   * If wallet changes, updates the component data
   * @param changes changes on the component
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.wallet.currentValue) {
      this.getUserKeys();
      this.getHoldtelClaimData();
    }
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets medals of the profile
   */
  async getUserKeys(): Promise<any> {
    if (this.wallet && this.wallet !== '') {
      this.keysQuery = this.apollo.use('marketplace').watchQuery({
        query: getUserKeys,
        pollInterval: 30000,
        variables: {
          wallet: this.wallet.toLowerCase()
        }
      });
      this.querySubscription = this.keysQuery
        .valueChanges
        .subscribe( async (res: any) => {
          console.log(res);
          if (res.data.usersInventories.length > 0) {
            this.holdtelKeys = res.data.usersInventories[0].keys;
            this.preAlphaKeys = await this.utilsService.parseMetadata(res.data.usersInventories[0].preAlpha);
            if (this.holdtelKeys.length > 0 || this.preAlphaKeys.length > 0) {
              this.userHasKeys = true;
            } else {
              this.userHasKeys = false;
            }
          }
      });
    }
  }

  /**
   * Gets the claim data of the user
   */
  async getHoldtelClaimData(): Promise<any> {
    const isConnected = await this.connectionService.isWalletConnected();
    if (this.wallet && isConnected) {
      if (this.wallet.toLowerCase() === this.connectionService.getWalletAddress().toLowerCase()) {
        this.claimData = await this.holdtelService.getHoldtelClaimData(this.wallet);
      }
      console.log(this.claimData);
      if (this.interval) { clearInterval(this.interval); }
      this.loadingKeysData = false;
    }

  }

  /**
   * Claims the key of the user
   */
  async claimKey(): Promise<any> {
    await this.holdtelService.claimKey(this.claimData.size, this.claimData.merkleProof).then( () => {
      this.getHoldtelClaimData();
    });
  }

}
