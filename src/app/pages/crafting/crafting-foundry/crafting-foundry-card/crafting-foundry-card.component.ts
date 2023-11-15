import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { FoundryService } from 'src/app/shared/services/foundry/foundry.service';
import { DialogService } from '../../../../shared/services/dialog.service';

@Component({
  selector: 'app-crafting-foundry-card',
  templateUrl: './crafting-foundry-card.component.html',
  styleUrls: ['./crafting-foundry-card.component.scss']
})
export class CraftingFoundryCardComponent implements OnInit, OnDestroy {
  @Input() pool: number;
  countdownEnd: number;
  walletIsConnected: boolean;
  userAddress: string = '';
  poolIsAvailable: boolean = false;
  poolDataIsLoaded: boolean = false;
  poolPrices: any = { usd: '', gq: ''}
  poolData: any;
  interval: any;
  @Output() fullCapacityAvailableEvent = new EventEmitter<any>();

  constructor(
    private connectionService: ConnectionService,
    private foundryService: FoundryService,
    private dialogService: DialogService
  ) {}

  /**
   * Gets pool data when wallet exists and set refresh every 5s
   */
  ngOnInit(): void {
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        this.userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getPoolData();
        this.interval = setInterval(() => {
          this.getPoolData();
        }, 5000);
      } else {
        if (this.interval) { clearInterval(this.interval); }
      }
    });
  }

  /**
   * Clear interval if exists
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Opens wallet connection modal
   */
  connectWallet(): void {
    this.connectionService.openModal();
  }

  /**
   * Receive data from cowndown
   * @param $event
   */
  receiveCountdownData($event: any): void {
    this.countdownEnd--;
  }

  /**
   * Gets the data of the pool
   */
  async getPoolData(): Promise<any> {
    await this.getPoolAvailability();
    if (this.poolIsAvailable) {
      this.poolData = await this.foundryService.getPoolData(this.userAddress, this.pool);
      const isUpgraded = this.poolData.isUpgraded === true && this.poolData.items.exists === false ? true : false;
      this.fullCapacityAvailableEvent.emit({pool: this.pool, isUpgraded});
      this.poolDataIsLoaded = true;
    } else {
      this.poolPrices = await this.foundryService.getPoolUnlockingPrice(this.pool);
      this.poolDataIsLoaded = true;
    }
    // console.log('---------------');
    // console.log('Pool', this.pool);
    // console.log('is available?', this.poolIsAvailable);
    // console.log('unlock price', this.poolPrices);
    // console.log('Data: ', this.poolData)
    // console.log('---------------');
  }

  /**
   * Get the availability of the pool
   */
  async getPoolAvailability(): Promise<any> {
    this.poolIsAvailable = await this.foundryService.userUnlockedPools(this.userAddress, this.pool);
  }

  /**
   * Claims the rewards of the pool
   */
  async claimRewards(): Promise<any> {
    this.foundryService.claimFoundryPool(this.pool);
  }

  /**
   * Accelerates the pool and claim rewards
   */
  async accelerateAndClaim(): Promise<any> {
    this.foundryService.accelerateAndClaimFoundryPool(this.pool);
  }

  /**
   * Unlocks the pool
   */
  async unlockPool(): Promise<any> {
    this.foundryService.unlockPool(this.pool);
  }

  /**
   * Upgrade the pool
   */
  async upgradePool(): Promise<any> {
    this.foundryService.upgradePool(this.pool);
  }

}
