import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MaterialExtractionService } from 'src/app/shared/services/lands/material-extraction.service';

@Component({
  selector: 'app-material-extraction-card',
  templateUrl: './material-extraction-card.component.html',
  styleUrls: ['./material-extraction-card.component.scss']
})
export class MaterialExtractionCardComponent implements OnInit, OnDestroy {
  @Input() size: number;
  @Input() lands: any[];
  landSizes: string[] = ['Nano', 'Micro', 'Standard', 'Macro', 'Mega']
  walletIsConnected: boolean = false;
  showInfo: boolean = false;
  hasLandStaked: boolean = false;
  loadingData: boolean = false;
  selectingLand: boolean = false;
  poolData: any;
  pendingRewards: any;
  poolRewards: any;
  interval: any;
  poolDepositFee: string = '';
  discounts: any = { cost: 0, time: 0 };

  constructor(
    private connectionService: ConnectionService,
    private materialExtractionService: MaterialExtractionService
  ) {}

  ngOnInit(): void {
    this.getPoolRewards();
    this.getPoolDepositFee();
    this.getPoolCraftingDiscounts();
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        this.loadingData = true;
        this.getPoolData();
      }
    });
  }

  /**
   * Clear the interval
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Open modal to connect wallet
   */
  openModal(): void {
    this.connectionService.openModal();
  }

  /**
   * Switch the land selection menu
   */
  switchLandSelection(): void {
    this.selectingLand = !this.selectingLand;
  }

  /**
   * Switch the land selection menu
   */
  switchPoolInfo(): void {
    this.showInfo = !this.showInfo;
  }

  /**
   * Get data of pool rewards
   */
  async getPoolRewards(): Promise<any> {
    this.poolRewards = await this.materialExtractionService.getStakedLandPoolRewards(this.landSizes[this.size]);
  }

  /**
   * Get fee of pool deposit
   */
  async getPoolDepositFee(): Promise<any> {
    this.poolDepositFee = await this.materialExtractionService.getPoolDepositFee();
  }

  /**
   * Gets the data of the pool
   */
  async getPoolData(): Promise<any> {
    this.poolData = await this.materialExtractionService.getLandStakePoolData(this.landSizes[this.size]);
    if (this.poolData.staked) {
      await this.setPendingRewards();
      this.setPendingRewardsInterval();
    }
    this.hasLandStaked = this.poolData.staked;
    console.log('Pool data:', this.poolData);
    this.loadingData = false;
  }

  /**
   * Gets pool crafting discounts for this land size
   */
  async getPoolCraftingDiscounts(): Promise<any> {
    this.discounts = await this.materialExtractionService.getPoolCraftingDiscount(this.landSizes[this.size]);
  }

  /**
   * Get the pending rewards
   */
  async setPendingRewards(): Promise<any> {
    this.pendingRewards = await this.materialExtractionService.getStakedLandPendingRewards(this.landSizes[this.size]);
  }

  /**
   * Set an interval to read pending rewards
   */
  async setPendingRewardsInterval(): Promise<any> {
    this.interval = setInterval(async () => {
      await this.setPendingRewards();
    }, 5000);
  }

  /**
   * Deposit land on it's corresponding pool
   * @param tokenId id of the land NFT
   */
  async depositLand(tokenId: number): Promise<any> {
    this.selectingLand = false;
    this.materialExtractionService.depositLand(tokenId, this.landSizes[this.size]).then( () => {
      this.getPoolData();
    });
  }

  /**
   * Withdraw the land NFT from the pool
   */
  async withdrawLand(): Promise<any> {
    await this.materialExtractionService.withdrawLand(this.landSizes[this.size]).then( () => {
      this.getPoolData();
    });
  }

  /**
   * Claim the rewarded materials
   */
  claimMaterials(): void {
    this.materialExtractionService.claimMaterials(this.landSizes[this.size]).then( () => {
      this.setPendingRewards();
    });
  }
}
