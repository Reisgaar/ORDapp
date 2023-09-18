import { Component, OnDestroy, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { StakeService } from 'src/app/shared/services/governance/stake.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

/**
 * Voting Power Stake Pools
 */
@Component({
  selector: 'app-governance-getvp',
  templateUrl: './governance-getvp.component.html',
  styleUrls: ['./governance-getvp.component.scss']
})
export class GovernanceGetvpComponent implements OnInit, OnDestroy {
  poolInfo0: any;
  poolInfo1: any;
  poolInfo2: any;
  totalStaked0: string;
  totalStaked1: string;
  totalStaked2: string;
  totalStaked: number;
  totalSupply: number;
  interval: any;

  constructor(
    private stakeService: StakeService,
    private tokenService: TokenService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.interval = setInterval(async () => {
      this.getData();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Get data of governance pools
   */
  async getData(): Promise<void> {
    this.poolInfo0 = await this.stakeService.getPoolInfo(0);
    this.poolInfo1 = await this.stakeService.getPoolInfo(1);
    this.poolInfo2 = await this.stakeService.getPoolInfo(2);
    this.totalStaked0 = this.connectionService.fromWei(this.poolInfo0.totalStaked);
    this.totalStaked1 = this.connectionService.fromWei(this.poolInfo1.totalStaked);
    this.totalStaked2 = this.connectionService.fromWei(this.poolInfo2.totalStaked);
    this.totalStaked = parseFloat(this.totalStaked0) + parseFloat(this.totalStaked1) + parseFloat(this.totalStaked2);
    const totalSupplyWei = await this.tokenService.getTokenTotalSupply(contractAddresses.vp);
    this.totalSupply = parseFloat(this.connectionService.fromWei(totalSupplyWei));
  }

}
