import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BigNumber } from 'ethers';
import { Pool } from 'src/app/interfaces/pool';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { gqPriceOnBusd, bnbPriceOnBusd, ipxPriceOnBusd, sckPriceOnBusd, cpoPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { OracleApiService } from 'src/app/shared/services/oracle-api.service';

@Component({
  selector: 'app-apy',
  templateUrl: './apy.component.html',
  styleUrls: ['./apy.component.scss']
})
export class ApyComponent implements OnInit{
  rewardPerBlock!: number;
  rewardPerBlockOwn!: number;

  aprDayOwn;
  aprWeekOwn;
  aprMonthOwn;

  aprDay;
  aprWeek;
  aprMonth;

  rewardPerBlockOwn1: any;
  rewardPerBlockOwn2: any;
  tokenPrice: any;

  aprDayOwn1;
  aprWeekOwn1;
  aprMonthOwn1;

  aprDay1;
  aprWeek1;
  aprMonth1;

  aprDayOwn2;
  aprWeekOwn2;
  aprMonthOwn2;

  aprDay2;
  aprWeek2;
  aprMonth2;

  isConnected: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ApyComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private connectionService: ConnectionService,
    private dexService: DexService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isConnected = await this.connectionService.isWalletConnected();
    this.dexService.setTokenPricesOnBusd();
    if(this.data.pool.type == 'farm'){

      await this.getApy();
      return;
    }

    this.tokenPrice = await this.dexService.tokenPrice(this.data.pool);
    if(this.data.pool.type == 'GalacticAlliance'){
      await this.getGalacticAllianceApy(this.data.pool);
    }

    if(this.data.pool.type == 'Stake' || 'GalacticReserve'){
      await this.getStakeApy(this.data.pool);
    }


  }



/**
 * Get reward. Related to staked token user and reward per 1 LP token
 */
async getApy(): Promise<any>{
  const rewardBlockWei = this.data.resourcePerBlock;
  const rewardPerBlock = this.connectionService.fromWei(rewardBlockWei);
  const rewardPerSecond = (this.data.totalAllocPoint / this.data.totalAllocPoint) * parseFloat(rewardPerBlock) / 3.03;
  if(this.data.isConnected && this.data.pool.staked!='0'){
  this.rewardPerBlockOwn1 = ((parseFloat(this.data.staked) / parseFloat(this.data.stakedTotal)) * rewardPerSecond);
  this.aprDayOwn1 = this.rewardPerBlockOwn1 * 86400;
  this.aprWeekOwn1 = this.rewardPerBlockOwn1 * 604800;
  this.aprMonthOwn1 = this.rewardPerBlockOwn1 * 2628000;
  }
  const rewardPerBlockMil1 =  ((1 / this.data.pool.stakedTotal) * rewardPerSecond);
  this.aprDay1 = rewardPerBlockMil1 * 86400;
  this.aprWeek1 = rewardPerBlockMil1 * 604800;
  this.aprMonth1 = rewardPerBlockMil1 * 2628000;
}

async getStakeApy(pool): Promise<any>{

  const rewardBlockWei1 = pool.rewardToken.length == 1
  ? await this.dexService.getStakeRewardPerBlock(pool.pool)
  : await this.dexService.getStakeRewardPerBlock(pool.pool, '1');
  const rewardPerBlock1 = this.connectionService.fromWei(rewardBlockWei1);
  this.rewardPerBlockOwn1 = ((parseInt(this.data.staked) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock1));
  this.aprDayOwn1 = this.rewardPerBlockOwn1 * 86400;
  this.aprWeekOwn1 = this.rewardPerBlockOwn1 * 604800;
  this.aprMonthOwn1 = this.rewardPerBlockOwn1 * 2628000;
  const rewardPerBlockMil1 = (((1000/this.tokenPrice) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock1));
  this.aprDay1 = rewardPerBlockMil1 * 86400;
  this.aprWeek1 = rewardPerBlockMil1 * 604800;
  this.aprMonth1 = rewardPerBlockMil1 * 2628000;
  console.log('reward stake',rewardPerBlockMil1, this.tokenPrice);

  if(pool.rewardToken.length == 2){
    const rewardBlockWei2 = await this.dexService.getStakeRewardPerBlock(pool.pool, '2');
    const rewardPerBlock2 = this.connectionService.fromWei(rewardBlockWei2);
    this.rewardPerBlockOwn2 = ((parseInt(this.data.staked) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock2));
    this.aprDayOwn2 = this.rewardPerBlockOwn1 * 86400;
    this.aprWeekOwn2 = this.rewardPerBlockOwn1 * 604800;
    this.aprMonthOwn2 = this.rewardPerBlockOwn1 * 2628000;
    const rewardPerBlockMil2 = (((1000/this.tokenPrice) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock2));
    this.aprDay2 = rewardPerBlockMil2 * 86400;
    this.aprWeek2 = rewardPerBlockMil2 * 604800;
    this.aprMonth2 = rewardPerBlockMil2 * 2628000;


  }
}


async getGalacticAllianceApy(pool): Promise<any>{

  const rewardBlockWei1 = await this.dexService.getStakeRewardPerBlock(pool.pool, '1');
  const rewardPerBlock1 = this.connectionService.fromWei(rewardBlockWei1);
  const rewardBlockWei2 = await this.dexService.getStakeRewardPerBlock(pool.pool, '2');
  const rewardPerBlock2 = this.connectionService.fromWei(rewardBlockWei2);
  // await this.getPriceToken().then(
  //   );

  this.rewardPerBlockOwn1 = ((parseInt(this.data.staked) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock1));
  this.aprDayOwn1 = this.rewardPerBlockOwn1 * 86400;
  this.aprWeekOwn1 = this.rewardPerBlockOwn1 * 604800;
  this.aprMonthOwn1 = this.rewardPerBlockOwn1 * 2628000;

  this.rewardPerBlockOwn2= ((parseInt(this.data.staked) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock2));
  this.aprDayOwn2 = this.rewardPerBlockOwn2 * 86400;
  this.aprWeekOwn2 = this.rewardPerBlockOwn2 * 604800;
  this.aprMonthOwn2 = this.rewardPerBlockOwn2 * 2628000;

  const rewardPerBlockMil1 = (((1000/this.tokenPrice) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock1));
  this.aprDay1 = rewardPerBlockMil1 * 86400;
  this.aprWeek1 = rewardPerBlockMil1 * 604800;
  this.aprMonth1 = rewardPerBlockMil1 * 2628000;

  const rewardPerBlockMil2 = (((1000/this.tokenPrice) / parseInt(this.data.stakedTotal)) * parseFloat(rewardPerBlock2));

  this.aprDay2 = rewardPerBlockMil2 * 86400;
  this.aprWeek2 = rewardPerBlockMil2 * 604800;
  this.aprMonth2 = rewardPerBlockMil2 * 2628000;
  console.log('reward galactic',rewardPerBlockMil1, rewardPerBlockMil2, this.tokenPrice);

}

/**
     * Get token price in dolars. If is GQ from 0x api, else get LP token price.
     */
// async getPriceToken(): Promise<any> {
//   if(this.data.token == contractAddresses.gq){
//     this.tokenPrice = gqPriceOnBusd;
  //   await this.tokenService.getTokenPrice(this.data.token, this.data.decimals)
  //   .then(item => {
  //     this.tokenPrice = parseFloat(item)});
  // }else{
  //   // If stake tokes is not GQ, Get tokens in LP
  //   const lpTokens = await this.lpService.getLpTokens(this.data.token);
  //   // Get pair
  //   const pairAddress = await this.lpService.getPair(lpTokens.token0, lpTokens.token1, this.data.factory);
  //   // Get reserves from pair
  //   const lpReserves = await this.lpService.getLpReserves(pairAddress);
  //   const priceToken0 = await this.tokenService.getTokenPrice(lpTokens.token0, this.data.decimals);
  //   const priceToken1 = await this.tokenService.getTokenPrice(lpTokens.token1, this.data.decimals);

  //   const totalSuply = await this.lpService.getTotalSupply(this.data.token);
  //   const token0Total = this.utils.fromWeiToNumber(lpReserves[0], this.data.decimals);
  //   const token1Total = this.utils.fromWeiToNumber(lpReserves[1], this.data.decimals);
  //   const totalLp = (parseInt(priceToken0) * token0Total)+(parseInt(priceToken1) * token1Total);
  //   const priceLp = totalLp / this.utils.fromWeiToNumber(totalSuply);

  //   // const totalValueLp = priceLp * this.data.totalStaked;
  //   this.tokenPrice = priceLp;
//   }
// }

  closePopUp(): void {
    this.dialogRef.close();
  }

}
