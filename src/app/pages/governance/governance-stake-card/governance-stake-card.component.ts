import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { StakeService } from 'src/app/shared/services/governance/stake.service';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';

/**
 * Card for GQ-VP pools
 */
@Component({
  selector: 'app-governance-stake-card',
  templateUrl: './governance-stake-card.component.html',
  styleUrls: ['./governance-stake-card.component.scss']
})
export class GovernanceStakeCardComponent implements OnInit, OnDestroy {
  @Input() pool: number;
  detailsShown = false;
  poolInfo = {
    accVoteTokenPerShare: '',
    allocPoint: '',
    lastRewardBlock: '',
    multiplier: '',
    stakeToken: '',
    timeLock: '',
    totalStaked: ''
  };
  userInfo = {
    amount: '',
    depositTimestamp: '',
    rewardDebt: ''
  };
  pendingVote = '';
  stakedGQ = '0';
  earned = 0;
  lockedUntil = 0;
  totalStaked = '';
  interval: any;
  withdrawIsBlocked = true;
  rewardPerBlock = 0;
  stakeDataLoading = true;
  wallet = '';

  constructor(
    private stakeService: StakeService,
    private connectionService: ConnectionService,
    private governanceDialogService: GovernanceDialogService,
  ) { }

  ngOnInit(): void {
    this.getPoolData();
    this.interval = setInterval(async () => {
      this.getPoolData();
    }, 3000);
  }

  /**
   * Clear interval if exist
   */
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Switch the visibility of the details of the card
   */
  showDetails(): void {
    this.detailsShown = !this.detailsShown;
  }

  /**
   * Gets the data of the pool
   */
  async getPoolData(): Promise<void> {
    try {
      this.poolInfo = await this.stakeService.getPoolInfo(this.pool);
      this.totalStaked = this.connectionService.fromWei(this.poolInfo.totalStaked);
      this.setRewardPerBlock();
      this.wallet = this.connectionService.getWalletAddress();
      this.userInfo = await this.stakeService.getUserInfo(this.pool);
      this.pendingVote = await this.stakeService.getPendingVoteToken(this.pool);
      this.stakedGQ = this.connectionService.fromWei(this.userInfo.amount);
      this.earned = parseFloat(this.connectionService.fromWei(this.pendingVote));
      this.lockedUntil = parseInt(this.userInfo.depositTimestamp, 0) + parseInt(this.poolInfo.timeLock, 0);
      this.checkLockedWithdraw();
      this.stakeDataLoading = false;
    } catch (error: any) { }
  }

  /**
   * Calculate the reward per block to show on view
   */
  async setRewardPerBlock(): Promise<void> {
    const totalAllocPoint = await this.stakeService.getTotalAllocPoint();
    const allocPoint = parseFloat(this.poolInfo.allocPoint);
    const tokenPerBlock = await this.stakeService.getVoteTokenPerBlock();
    this.rewardPerBlock = (allocPoint / totalAllocPoint) * tokenPerBlock * parseFloat(this.poolInfo.multiplier);
  }

  /**
   * Checks the status of the locking period to show on view
   */
  checkLockedWithdraw(): void {
    const nowInSecs = Date.now() / 1000;
    if (this.lockedUntil > nowInSecs || this.stakedGQ === '0') {
      this.withdrawIsBlocked = true;
    } else {
      this.withdrawIsBlocked = false;
    }
  }

  /**
   * Claim the reward of the pool
   */
  async claimReward(): Promise<void> {
    await this.stakeService.claim(this.pool);
  }

  /**
   * Deposit GQ on the pool
   */
  async deposit(): Promise<void> {
    await this.governanceDialogService.openStakingDialog('deposit', this.pool).afterClosed().subscribe( async (res: any) => {
      try {
        const amount = res.toString();
        await this.stakeService.deposit(this.pool, amount);
      } catch (error: any) { }
    });
  }


  /**
   * Withdraw from the pool
   */
  async withdraw(): Promise<void> {
    await this.governanceDialogService.openStakingDialog('withdraw', this.pool).afterClosed().subscribe( async (res: any) => {
      try {
        const amount = res.toString();
        await this.stakeService.withdraw(this.pool, amount);
      } catch (error: any) { }
    });
  }

  /**
   * Sets VP on metamask
   */
  async setVpOnMetamask(): Promise<void> {
    await this.connectionService.setTokenOnMetamask('ERC20', contractAddresses.vp, 'VP', '18', '');
  }

  /**
   * Sets GQ on metamask
   */
  async setGqOnMetamask(): Promise<void> {
    await this.connectionService.setTokenOnMetamask('ERC20', contractAddresses.gq, 'GQ', '18', '');
  }

}
