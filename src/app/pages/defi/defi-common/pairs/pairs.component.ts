import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Pool } from 'src/app/interfaces/pool';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss'],
})
export class PairsComponent implements OnInit {
  farms: Pool[] = [];
  displayedColumns: string[] = ['farm'];
  pool: Pool;
  dataSource;

  constructor(
    public dialogRef: MatDialogRef<PairsComponent>,
    private connectionService: ConnectionService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, type:string },
    private dexService: DexService
  ) { }
  async ngOnInit(): Promise<void> {
    console.log(this.data);
    this.data.type == 'liquidity'
    ? this.farms = await this.dexService.getPools()
    : this.farms = await this.dexService.getTotalPools();
    console.log(this.farms);
    this.dataSource = new MatTableDataSource<Pool>(this.farms);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  async selectFarm(farm: Pool): Promise<void> {
    this.pool = farm;
    console.log('farm',farm);
    // await this.getPoolId(this.pool.farm, this.pool.address);
    // await this.getInfo(this.pool.farm, this.pool.address);
    await this.getInfoLp(farm.address);
    // await this.getStakedTotal(this.pool.farm, this.pool.address);



    this.dialogRef.close(this.pool);
  }

  async getPoolId(farm: string, address: string): Promise<any> {
    this.pool.id = await this.dexService.getPoolId(farm, address);
  }

  // async getInfo(farm: string, address: string) {

  //   const functions = [
  //     { function: 'positionPoolsByLP', args: [address] },
  //     { function: 'resource', args: [] },
  //     { function: 'resourcePerBlock', args: [] },
  //     { function: 'poolInfo', args: [this.pool.id] },
  //     { function: 'totalAllocPoint', args: [] },
  //     // { function: 'pendingResource', args: [this.pool.id, this.userAccount] },

  //   ];
  //   const info = await this.dexService.getInfo(farm, functions, 'farm');
  //   info[0].status === 'success'
  //     ? (this.pool.id = info[0].result.toString())
  //     : (this.pool.id = '');
  //   info[1].status === 'success'
  //     ? (this.pool.rewardToken = info[1].result)
  //     : (this.pool.rewardToken = '');
  //     console.log('info2',info[2]);
  //   info[2].status === 'success'
  //     ? (this.pool.resourcePerBlock = info[2].result.toString())
  //     : (this.pool.resourcePerBlock = '');
  //   if (info[3].status === 'success') {
  //     this.pool.stakedToken = info[3].result[0];
  //     this.pool.allocPoint = info[3].result[1];
  //   }
  //   info[4].status === 'success'
  //     ? (this.pool.totalAllocPoint = info[4].result.toString())
  //     : (this.pool.totalAllocPoint = '');
  //   // info[5].status === 'success'
  //   //   ? (this.pool.pendingRewards = this.connectionService.fromWei(info[5].result.toString()))
  //   //   : (this.pool.pendingRewards = '');

  //   this.pool.stakedToken ? await this.getInfoLp(this.pool.stakedToken) : null;
  //   this.pool.rewardToken
  //     ? await this.getInfoRewardToken(this.pool.rewardToken)
  //     : null;
  //   // this.pool.type = 'farm';
  // }

  async getInfoLp(address: string): Promise<any> {
    const functions = [
      { function: 'token0', args: [] },
      { function: 'token1', args: [] },
    ];
    const info = await this.dexService.getInfo(address, functions, 'lp');
    info[0].status === 'success'
      ? (this.pool.subsidiaryToken1 = info[0].result)
      : (this.pool.subsidiaryToken1 = '');
    info[1].status === 'success'
      ? (this.pool.subsidiaryToken2 = info[1].result)
      : (this.pool.subsidiaryToken2 = '');

    const infoSubsidiary1 = await this.connectionService.fetchToken(
      this.pool.subsidiaryToken1
    );
    const infoSubsidiary2 = await this.connectionService.fetchToken(
      this.pool.subsidiaryToken2
    );
    if (infoSubsidiary1) {
      this.pool.subsidiaryTokenName1 = infoSubsidiary1.name;
      this.pool.subsidiaryTokenSymbol1 = infoSubsidiary1.symbol;
      this.pool.subsidiaryTokenDecimals1 = infoSubsidiary1.decimals;
    }
    if (infoSubsidiary2) {
      this.pool.subsidiaryTokenName2 = infoSubsidiary2.name;
      this.pool.subsidiaryTokenSymbol2 = infoSubsidiary2.symbol;
      this.pool.subsidiaryTokenDecimals2 = infoSubsidiary2.decimals;
    }
  }
  async getInfoRewardToken(address: any): Promise<any> {
    const tokenValue = await this.connectionService.fetchToken(address);
    if (tokenValue) {
      this.pool.rewardTokenName = tokenValue.name;
      this.pool.rewardTokenSymbol = tokenValue.symbol;
      this.pool.rewardTokenDecimals = tokenValue.decimals;
    }
  }
}
