import { Component, OnInit } from '@angular/core';
import { PairsComponent } from '../defi-common/pairs/pairs.component';
import { MatDialog } from '@angular/material/dialog';
import { BigNumber, FixedNumber } from 'ethers';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { Subscription, interval } from 'rxjs';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { PairData } from 'src/app/interfaces/pair-data';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { AddLiquidity } from 'src/app/interfaces/add-liquidity';
import { Pool } from 'src/app/interfaces/pool';
import { MatTableDataSource } from '@angular/material/table';
import { DexDialogService } from 'src/app/shared/services/dex-dialog.service';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss'],
})
export class LiquidityComponent implements OnInit {
  liquidityPlus: AddLiquidity = {
    token1: '',
    tokenName1: '',
    amount1: '0',
    tokenImg1: '',
    tokenBalance1: BigNumber.from(0),
    subsidiaryTokenSymbol1: '',
    tokenDecimals1: null,
    token2: '',
    tokenName2: '',
    amount2: '0',
    tokenImg2: '',
    tokenBalance2: BigNumber.from(0),
    subsidiaryTokenSymbol2: '',
    tokenDecimals2: null,
    slippage: localStorage.getItem('slipTolerance'),
  };
  pairData: PairData;
  approvedPair: boolean = false;
  approvedPairFirst: boolean = false;
  approvedPairSecond: boolean = false;
  subscription!: Subscription;
  firstPerSecond: BigNumber;
  secondPerFirst: BigNumber;
  shareOfPool: string;
  positionFirst: BigNumber;
  positionSecond: BigNumber;

  inputSecond: FixedNumber;
  inputFirst: FixedNumber;

  longInputFirst: FixedNumber;
  longInputSecond: FixedNumber;

  tradeType: number;

  error: boolean = false;
  errorText: string = '';
  firstPool = true;

  thinking: boolean = false;
  availablePairs: Pool[] = [];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['pair'];

  connected: boolean = true;
  addLiquidity: boolean = false;
  noPairs: boolean;
  pairSelected: boolean = false;
  userAddr: string;

  constructor(
    public dialog: MatDialog,
    private tokenService: TokenService,
    private dexService: DexService,
    private connectionService: ConnectionService,
    private dexDialogService: DexDialogService
  ) { }

  async ngOnInit(): Promise<any> {
    this.connected = await this.connectionService.isWalletConnected();
    this.userAddr = await this.connectionService.getWalletAddress();
    this.connected ? this.getLPReserves() : (this.noPairs = true);
  }

  async getLPReserves(): Promise<void> {
    const totalPairs = await this.dexService.getPools();
    await this.getPairsReserves(totalPairs);
  }

  async getPairsReserves(res: Pool[]): Promise<void> {
    this.thinking = true;
    for await (const pair of res) {
      // if(pair.type == 'lp-gq'){
      const pairBalanceUser = await this.dexService.balanceOf(pair.address);
      // await this.lpService.getStakedToken(pair.address).then(arg => pair.stakedToken = arg);
      if (pairBalanceUser != 0) {
        const arg = await this.dexService.getPairData(
          pair.address,
          pair.subsidiaryToken1,
          pair.subsidiaryToken2
        );
        pair.liquidityData = pairBalanceUser;
        pair.subsidiaryToken1 = arg.token0;
        pair.subsidiaryToken2 = arg.token1;
        pair.subsidiaryTokenName1 = arg.name;
        pair.subsidiaryTokenDecimals1 = arg.decimals;
        pair.subsidiaryTokenName2 = arg.name;
        pair.subsidiaryTokenDecimals2 = arg.decimals;
        pair.subsidiaryTokenReserve1 = arg.reserve0;
        pair.subsidiaryTokenReserve2 = arg.reserve1;
        this.availablePairs.push(pair);
      }
    }
    this.dataSource = new MatTableDataSource(this.availablePairs);
    this.thinking = false;
  }

  goToAdd() {
    this.addLiquidity = !this.addLiquidity;
  }

  goToMinus(pair: Pool) {
    this.dexDialogService.openLiquidityMinus(pair);
  }

  max(token: string) {
    if (token == '1') {
      this.liquidityPlus.amount1 = this.connectionService.fromWei(this.liquidityPlus.tokenBalance1.toString());
      this.setValues('1');
    }
    if (token == '2') {
      this.liquidityPlus.amount2 = this.connectionService.fromWei(this.liquidityPlus.tokenBalance2.toString());
      this.setValues('2');
    }
  }

  async setPair() {
    const dialogRef = this.dialog.open(PairsComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { title: 'pairs' },
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.liquidityPlus.token1 = result.subsidiaryToken1;
        this.liquidityPlus.subsidiaryTokenSymbol1 = result.subsidiaryTokenSymbol1;
        this.liquidityPlus.token2 = result.subsidiaryToken2;
        this.liquidityPlus.subsidiaryTokenSymbol2 = result.subsidiaryTokenSymbol2;
        this.liquidityPlus.tokenName1 = result.subsidiaryTokenName1;
        this.liquidityPlus.tokenName2 = result.subsidiaryTokenName2;
        this.liquidityPlus.tokenImg1 = result.subsidiaryTokenImg1;
        this.liquidityPlus.tokenImg2 = result.subsidiaryTokenImg2;
        this.pairSelected = true;
        await this.setPairToAdd();
        // await this.checkIsAllowed(result);
        await this.validatePair(true, result); // to false if subscription
      }
    });
  }

  async setPairToAdd(): Promise<void> {
    try {
      this.liquidityPlus.tokenBalance1 =
        await this.tokenService.getBalanceOfToken(this.liquidityPlus.token1);
      this.liquidityPlus.tokenBalance2 =
        await this.tokenService.getBalanceOfToken(this.liquidityPlus.token2);
    } catch (error) {
      this.error = true;
      this.errorText = 'Insufficient liquidityPlus';
      if (!this.connected) {
        console.log('error', error);
        this.errorText = 'Please connect your wallet';
        return;
      }
      this.errorText = 'Insufficient liquidityPlus';
      return;
    }
  }

  async checkIsAllowed(result): Promise<void> {
    this.approvedPair = false;
    this.approvedPairFirst = false;
    this.approvedPairSecond = false;
    if (!result) {
      this.subscription.unsubscribe();
      return;
    }
    console.log('them');
  }

  async subscribePairValidation(result): Promise<void> {
    try {
      this.subscription = interval(3000).subscribe(
        async () => await this.validatePair(true, result)
      );
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async validatePair(subscribed, result): Promise<void> {
    console.log('suscribed', subscribed);
    if (subscribed == false) {
      this.error = false;
      this.firstPool = false;
      // Ask if this pair is allowed or not
      await this.checkIsAllowed(result).then();
      await this.subscribePairValidation(result);
    }

    this.pairData = await this.dexService.getPairData(
      result.stakedToken,
      result.subsidiaryToken1,
      result.subsidiaryToken2
    );
    const token0 = await this.connectionService.fetchToken(result.subsidiaryToken1);
    const token1 = await this.connectionService.fetchToken(result.subsidiaryToken2);
    this.pairData.tokenDecimals0 = token0.decimals;
    this.pairData.tokenDecimals1 = token1.decimals;
    console.log(token1);
    if (this.pairData.addr === '0x0000000000000000000000000000000000000000') {
      this.subscription.unsubscribe();
      this.firstPool = true;
      return;
    }

    this.shareOfPool = '0.000 %';
    // Swap if tokens are out of order
    let reserve0 = this.pairData.reserve0;
    let reserve1 = this.pairData.reserve1;
    if (this.pairData.token0 === result.subsidiaryToken2) {
      reserve0 = this.pairData.reserve1;
      reserve1 = this.pairData.reserve0;
    }
    this.positionFirst = BigNumber.from(reserve0).div(
      BigNumber.from('10').pow(this.pairData.tokenDecimals0)
    );
    this.positionSecond = BigNumber.from(reserve1).div(
      BigNumber.from(10).pow(this.pairData.tokenDecimals0)
    );
    if (
      !this.dexService.validateInput(
        this.liquidityPlus.tokenBalance1.toString()
      )
    ) {
      this.error = true;
      this.errorText = 'Insufficient Balance ' + this.liquidityPlus.subsidiaryTokenSymbol1;
      return;
    }

    if (
      !this.dexService.validateInput(
        this.liquidityPlus.tokenBalance2.toString()
      )
    ) {
      this.error = true;
      this.errorText = 'Insufficient Balance ' + this.liquidityPlus.subsidiaryTokenSymbol2;
      return;
    }
    // this.subscription.unsubscribe();
  }

  /**
   * Set input values
   */
  async setValues(where: string): Promise<void> {
    // let input: BigNumber;
    this.liquidityPlus.amount1 == '' ? this.inputFirst = FixedNumber.from(0) : this.inputFirst = FixedNumber.from(this.liquidityPlus.amount1);
    this.liquidityPlus.amount2 == '' ? this.inputSecond = FixedNumber.from(0) : this.inputSecond = FixedNumber.from(this.liquidityPlus.amount2);;
    // this.inputFirst = FixedNumber.from(this.liquidityPlus.amount1);
    // this.inputSecond = FixedNumber.from(this.liquidityPlus.amount2);

    if (
      !this.dexService.validateInput(
        this.liquidityPlus.tokenBalance1.toString()
      )
    ) {
      this.error = true;
      this.errorText = 'Insufficient Balance ' + this.liquidityPlus.subsidiaryTokenSymbol1;
      return;
    }

    if (
      !this.dexService.validateInput(
        this.liquidityPlus.tokenBalance2.toString()
      )
    ) {
      this.error = true;
      this.errorText = 'Insufficient Balance ' + this.liquidityPlus.subsidiaryTokenSymbol2;
      return;
    }

    if (where === '1') {
      this.tradeType = 1;
      console.log('compare',  BigNumber.from(this.connectionService.toWei(this.liquidityPlus.amount1)), this.liquidityPlus.tokenBalance1);
      if (
        BigNumber.from(this.inputFirst).gt(
          BigNumber.from(this.liquidityPlus.tokenBalance1.toString())
        )
      )
     {
        this.error = true;
        this.errorText =
          'Insufficient Balance ' + this.liquidityPlus.subsidiaryTokenSymbol1;
      } else {
        this.error = false;
      }

      // this.longInputFirst = input;
      // if (!this.firstPool) {
      this.longInputSecond = await this.dexService.getOtherAmountOfPair(
        this.pairData.addr,
        this.inputFirst,
        this.liquidityPlus.token2,
        this.pairData.token0,
        this.pairData.token1,
        this.pairData.reserve0,
        this.pairData.reserve1
      );
      this.liquidityPlus.amount2 = this.longInputSecond.toString();

      const share =
        (parseFloat(this.inputFirst._value) /
          parseFloat(this.positionFirst.toString())) *
        100;
      this.shareOfPool = String(share.toFixed(5)) + ' %';
      if (
        BigNumber.from(this.longInputSecond).gt(
          BigNumber.from(this.liquidityPlus.tokenBalance2)
        )
      ) {
        this.error = true;
        this.errorText =
          'Insufficient Balance ' + '' + this.liquidityPlus.subsidiaryTokenSymbol2;
      } else {
        this.error = false;
      }
      // }
    }
    if (where === '2') {
      this.tradeType = 2;
      if (
        BigNumber.from(this.inputSecond).gt(
          BigNumber.from(this.liquidityPlus.tokenBalance2.toString())
        )
      ) {
        this.error = true;
        this.errorText =
          'Insufficient Balance' + '' + this.liquidityPlus.tokenName2;
      } else {
        this.error = false;
      }

      this.longInputFirst = await this.dexService.getOtherAmountOfPair(
        this.pairData.addr,
        this.inputSecond,
        this.liquidityPlus.token1,
        this.pairData.token0,
        this.pairData.token1,
        this.pairData.reserve0,
        this.pairData.reserve1
      );
      this.liquidityPlus.amount1 = this.longInputFirst.toString();

      const share =
        (parseFloat(this.inputSecond._value) /
          parseFloat(this.positionSecond.toString())) *
        100;
      this.shareOfPool = String(share.toFixed(5)) + ' %';
      console.log('share', share, this.shareOfPool);


      if (
        BigNumber.from(this.longInputFirst).gt(
          BigNumber.from(this.liquidityPlus.tokenBalance1)
        )
      ) {
        this.error = true;
        this.errorText =
          'Insufficient Balance ' + '' + this.liquidityPlus.subsidiaryTokenSymbol1;
      } else {
        this.error = false;
      }
      // }
    }
    if (
      this.liquidityPlus.tokenBalance1.toString() == '' ||
      this.liquidityPlus.tokenBalance2.toString() == ''
    ) {
      this.error = true;
      this, (this.errorText = 'Insufficient balance in wallet');
      return;
    }

    // this.isDisabled = this.checkIfSupplyIsDisabled();
  }

  // Add liquidity to Pair. Open dialog to confirm
  async addLiquidityToPair(): Promise<void> {
    try {
      // Get slippage and deadline values
      const slippage = Number(localStorage.getItem('slipTolerance'));
      // Deadline to seconds
      const deadline = Number(localStorage.getItem('transDeadLine')) * 60 + 120;
      console.log(
        this.liquidityPlus.token1,
        this.liquidityPlus.token2,
        this.liquidityPlus.amount1,
        this.liquidityPlus.amount2,
        slippage,
        deadline,
        this.userAddr
      );
      const receipt = await this.dexService.addLiquidityAny(
        this.liquidityPlus.token1,
        this.liquidityPlus.token2,
        this.liquidityPlus.amount1,
        this.liquidityPlus.amount2,

        slippage,
        deadline,
        this.userAddr
      );
      // Only reset amounts, keep token selections
      await this.clearForm();
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  async clearForm(): Promise<void> {
    await this.setPairToAdd();
    // await this.checkIsAllowed();
    // await this.validatePair(false, );
    this.liquidityPlus.amount1 = '';
    this.liquidityPlus.amount2 = '';
  }

  async connectWallet(): Promise<void> {
    await this.connectionService.openModal();
    this.connected = await this.connectionService.isWalletConnected();
    this.connected ? this.getLPReserves() : (this.noPairs = true);

  }
}
