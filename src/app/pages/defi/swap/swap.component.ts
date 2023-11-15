import { Component, OnDestroy, OnInit } from '@angular/core';
import { PairsComponent } from '../defi-common/pairs/pairs.component';
import { MatDialog } from '@angular/material/dialog';
import { Pool } from 'src/app/interfaces/pool';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { Subscription, interval } from 'rxjs';
import { BigNumber, FixedNumber } from 'ethers';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { PairData } from 'src/app/interfaces/pair-data';
import { PopUpCustomAllowanceComponent } from '../../allowance-manager/pop-up-custom-allowance/pop-up-custom-allowance.component';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit, OnDestroy {
  farm: Pool = {
    id: '',
    address: '',
    allocPoint: '',
    allowance: false,
    totalAllocPoint: '',
    lockupDuration: NaN,
    timeLockup: NaN,
    stakedToken: '',
    stakedTokenSymbol: '',
    stakedTokenName: '',
    stakedTokenImg: '',
    stakedTokenDecimals: NaN,
    subsidiaryToken1: '',
    subsidiaryTokenSymbol1: '',
    subsidiaryTokenName1: '',
    subsidiaryTokenImg1: '',
    subsidiaryTokenDecimals1: NaN,
    subsidiaryToken2: '',
    subsidiaryTokenSymbol2: '',
    subsidiaryTokenName2: '',
    subsidiaryTokenImg2: '',
    subsidiaryTokenDecimals2: NaN,
    subsidiaryTokenReserve1: '',
    subsidiaryTokenReserve2: '',
    resourcePerBlock: '',
    rewardToken: '',
    rewardTokenSymbol: '',
    rewardTokenName: '',
    rewardTokenImg: '',
    rewardTokenDecimals: NaN,
    rewardTokenPrice: 0,
    rewardDaily: NaN,
    rewardWeekly: NaN,
    rewardMonthly: NaN,
    rewardYearly: NaN,
    startBlock: NaN,
    actualBlock: NaN,
    endBlock: NaN,
    pendingRewards: '',
    // unStakeAmount: 0,
    rewardPerBlock: '',
    isApproved: false,
    hasStarted: false,
    hasEnded: false,
    staked: '0',
    stakedTotal: '',
    // roiDaily: NaN,
    // roiWeekly: NaN,
    // roiMonthly: NaN,
    // roiYearly: NaN,
    // roiYCompound: NaN,
    apr: NaN,
    tvl: BigNumber.from(0),
    // website: 'https://outerringmmo.com',
    fee: NaN,
    // multiplier: null,
    type: '',
    factory: '',
    liquidityData: 0,
    hasLimit: false,
    farm: '',
    // rewardTokenImg1: '',
    // rewardTokenImg2: '',
  };
  tokenFirstBalance: string = '';
  tokenSecondBalance: string = '';
  isConnected: boolean = false;
  error: boolean = false;
  errorText: string = '';
  firstPool = true;
  amount1: string = '0';
  amount2: string = '0';
  // swap = {
  //   token1: 'Token1',
  //   token1balance: '0000000.00000',
  //   token1Icon: 'gq_mini.jpg',
  //   token2: 'token2',
  //   token2balance: '0000000.00000',
  //   token2Icon: 'gq_mini.jpg',
  // };
  connected = true;
  approvedPair: boolean;
  approvedPairFirst: boolean;
  approvedPairSecond: boolean;

  subscription!: Subscription;
  firstPerSecond: BigNumber;
  secondPerFirst: BigNumber;
  shareOfPool: string;
  positionFirst: BigNumber;
  positionSecond: BigNumber;
  longInputFirst: FixedNumber;
  longInputSecond: FixedNumber;
  pairData: PairData;
  inputSecond: FixedNumber;
  inputFirst: FixedNumber
  isDisabled: boolean = false;
  slipTolerance: number = parseInt(localStorage.getItem('slipTolerance'));
  transDeadLine: string = localStorage.getItem('transDeadLine');
  minimunReceived: string;
  priceImpact: BigNumber;
  tradeType: number;
  walletTo: string = '';

  constructor(
    public dialog: MatDialog,
    private tokenService: TokenService,
    private connectionService: ConnectionService,
    private dexService: DexService,
    private dialogService: DialogService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  async ngOnInit(): Promise<any> {
    this.isConnected = await this.connectionService.isWalletConnected();
  }

  max(token: string) {
    if (token == '1') { this.amount1 = this.connectionService.fromWei(this.tokenFirstBalance); this.setValues('1') };
    if (token == '2') { this.amount2 = this.connectionService.fromWei(this.tokenSecondBalance); this.setValues('2') };
  }

  async setPair() {
    const dialogRef = this.dialog.open(PairsComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { title: 'pairs', type:'swap' },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log('pair selected', result);
        this.farm = result;
        await this.setPairToAdd(result);
        await this.checkIsAllowed(result);
        await this.validatePair(false, result);
      }
    });
  }

  async setPairToAdd(farm: Pool) {
    try {
      this.tokenFirstBalance = await this.tokenService.getBalanceOfToken(
        farm.subsidiaryToken1
      );
      this.tokenSecondBalance = await this.tokenService.getBalanceOfToken(
        farm.subsidiaryToken2
      );
    } catch (error) {
        this.error = true;
        this.errorText = 'Insufficient liquidity';
        if (!this.isConnected) {
          console.log('error',error);
          this.errorText = 'Please connect your wallet';
          return;
        }
        this.errorText = 'Insufficient liquidity';
        return;
    }
  }

  async subscribePairValidation(result): Promise<void> {
    try {
      this.validatePair(true, result);
      this.subscription = interval(3000).subscribe(
        async () => await this.validatePair(true, result)
      );
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async validatePair(subscribed, result): Promise<void> {
    if (subscribed == false) {
      this.error = false;
      this.firstPool = false;
      // Ask if this pair is allowed or not
      await this.checkIsAllowed(result).then();
      await this.subscribePairValidation(result);
    }

    this.pairData = await this.dexService.getPairData(
      result.address,
      result.subsidiaryToken1,
      result.subsidiaryToken2
    );
    console.log('Pair',this.pairData);
    if (this.pairData.addr === '0x0000000000000000000000000000000000000000') {
      this.subscription.unsubscribe();
      this.firstPool = true;
      return;
    }
    const token0 = await this.connectionService.fetchToken(result.subsidiaryToken1);
    const token1 = await this.connectionService.fetchToken(result.subsidiaryToken2);
    this.pairData.tokenDecimals0 = token0.decimals;
    this.pairData.tokenDecimals1 = token1.decimals;

    const AperB = await this.dexService.getOtherAmountOfPairSwap(
      this.pairData.addr,
      FixedNumber.from(1),
      this.pairData.token0,
      this.pairData.token0,
      this.pairData.token1,
      this.pairData.reserve0,
      this.pairData.reserve1,
      this.pairData.tokenDecimals0,
      this.pairData.tokenDecimals1
    );
    const BperA = await this.dexService.getOtherAmountOfPairSwap(
      this.pairData.addr,
      FixedNumber.from(1),
      this.pairData.token1,
      this.pairData.token0,
      this.pairData.token1,
      this.pairData.reserve0,
      this.pairData.reserve1,
      this.pairData.tokenDecimals0,
      this.pairData.tokenDecimals1
    );
    this.firstPerSecond = BigNumber.from(AperB.toString()).pow(
      this.pairData.tokenDecimals1
    );
    this.secondPerFirst = BigNumber.from(BperA).pow(
      10 * this.pairData.tokenDecimals0
    );

    this.shareOfPool = '0.000 %';
    // Swap if tokens are out of order
    let reserve0 = this.pairData.reserve0;
    let reserve1 = this.pairData.reserve1;
    if (this.pairData.token0 === result.subsidiaryToken2) {
      reserve0 = this.pairData.reserve1;
      reserve1 = this.pairData.reserve0;
    }


    this.positionFirst = BigNumber.from(this.pairData.reserve0).div(BigNumber.from(10).pow(this.pairData.tokenDecimals0));
    this.positionSecond = BigNumber.from(this.pairData.reserve1).div(BigNumber.from(10).pow(this.pairData.tokenDecimals1));

    if (!this.dexService.validateInput(this.tokenFirstBalance.toString())) {
      this.error = true;
      this.errorText = 'Insufficient Balance ';
      return;
    }

    // if (!this.dexService.validateInput(this.tokenSecondBalance.toString())) {
    //   this.error = true;
    //   this.errorText = 'Insufficient Balance ';
    //   return;
    // }
    this.subscription.unsubscribe();
  }

  async changeDirection(): Promise<void>{
    const subsidiaryToken1 = this.farm.subsidiaryToken1;
    const subsidiaryToken2 = this.farm.subsidiaryToken2;
    const subsidiaryTokenDecimals1 = this.farm.subsidiaryTokenDecimals1;
    const subsidiaryTokenDecimals2 = this.farm.subsidiaryTokenDecimals2;
    const subsidiaryTokenImg1 = this.farm.subsidiaryTokenImg1;
    const subsidiaryTokenImg2 = this.farm.subsidiaryTokenImg2;
    const subsidiaryTokenName1 = this.farm.subsidiaryTokenName1;
    const subsidiaryTokenName2 = this.farm.subsidiaryTokenName2;
    const subsidiaryTokenReserve1 = this.farm.subsidiaryTokenReserve1;
    const subsidiaryTokenReserve2 = this.farm.subsidiaryTokenReserve2;
    const subsidiaryTokenSymbol1 = this.farm.subsidiaryTokenSymbol1;
    const subsidiaryTokenSymbol2 = this.farm.subsidiaryTokenSymbol2;
    // const tokenFirstBalance = this.tokenFirstBalance;
    // const tokenSecondBalance = this.tokenSecondBalance;
    const amount1 = this.amount1;
    const amount2 = this.amount2;

    this.farm.subsidiaryToken1 = subsidiaryToken2;
    this.farm.subsidiaryToken2 = subsidiaryToken1;
    this.farm.subsidiaryTokenDecimals1 = subsidiaryTokenDecimals2;
    this.farm.subsidiaryTokenDecimals2 = subsidiaryTokenDecimals1;
    this.farm.subsidiaryTokenImg1 = subsidiaryTokenImg2;
    this.farm.subsidiaryTokenImg2 = subsidiaryTokenImg1;
    this.farm.subsidiaryTokenName1 = subsidiaryTokenName2;
    this.farm.subsidiaryTokenName2 = subsidiaryTokenName1;
    this.farm.subsidiaryTokenReserve1 = subsidiaryTokenReserve2;
    this.farm.subsidiaryTokenReserve2 = subsidiaryTokenReserve1;
    this.farm.subsidiaryTokenSymbol1 = subsidiaryTokenSymbol2;
    this.farm.subsidiaryTokenSymbol2 = subsidiaryTokenSymbol1;
    // this.tokenFirstBalance = tokenSecondBalance;
    // this.tokenSecondBalance = tokenFirstBalance;
    this.amount1 = amount2;
    // this.amount2 = amount1;
    await this.setPairToAdd(this.farm);
    await this.validatePair(false, this.farm);
    await this.setValues('1');
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

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  // async customAllowance(): Promise<any> {
  //   const walletIsConnected = await this.connectionService.syncAccount();
  //   if (walletIsConnected) {
  //     this.dialog.open(PopUpCustomAllowanceComponent, {
  //       panelClass: 'lootbox-dialog-container'
  //     }).afterClosed().subscribe( res => {
  //       if (res) {
  //         console.log(res);
  //         const amount = this.connectionService.toWei(res);
  //         this.changeAllowance(amount);
  //       }
  //     });
  //   }
  // }

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  // async changeAllowance(amount?: string): Promise<any> {
  //   const walletIsConnected = await this.connectionService.syncAccount();
  //   if (walletIsConnected) {
  //     await this.tokenService.tokenApprove(this.pool.farm, this.pool.stakedToken, amount).then( () => {
  //       this.getAllowances();
  //     });
  //   }
  // }

  /**
   * Get and set all allowances of tokens in allowances constant
   */
  // async getAllowances(): Promise<any> {
  //         if (await this.connectionService.isWalletConnected()) {
  //           this.tokenService.getTokenAllowanceOnSpender(this.pool.stakedToken, this.pool.farm).then( res => {
  //             let allowed = this.connectionService.fromWei(res);
  //             if (parseFloat(allowed) > 0) {
  //               this.pool.isApproved = true;
  //             }
  //             if(parseFloat(allowed) == 0) {
  //               this.pool.isApproved = false;
  //             }

  //           });
  //         } else {
  //           // token['allowed'] = '';
  //           console.log('not allowed')
  //         }
  //       }
  //     }
  //   }
  //   // console.log(this.allowances);
  // }

  /**
   * Set input values
   */
  async setValues(where: string): Promise<void> {
    this.amount1 == '' ? this.inputFirst = FixedNumber.from(0) : this.inputFirst = FixedNumber.from(this.amount1);
    this.amount2 == '' ? this.inputSecond = FixedNumber.from(0) : this.inputSecond = FixedNumber.from(this.amount2);

    if (!this.dexService.validateInput(this.tokenFirstBalance.toString())) {
      this.error = true;
      this.errorText = 'Insufficient Balance ' + this.farm.subsidiaryTokenName1;
      return;
    }
    // if (!this.dexService.validateInput(this.tokenSecondBalance.toString())) {
    //   this.error = true;
    //   this.errorText = 'Insufficient Balance ' + this.farm.subsidiaryTokenName2;
    //   return;
    // }
    if (where === '1') {
      this.tradeType = 1;
      if (BigNumber.from(this.inputFirst).gt(BigNumber.from(this.tokenFirstBalance))) {
        this.error = true;
        this.errorText = 'Insufficient Balance ' + this.farm.subsidiaryTokenName1;
        return;
      } else {
        this.error = false;
      }
      this.longInputSecond = await this.dexService.getOtherAmountOfPairSwap(
        this.farm.address,
        this.inputFirst,
        // this.farm.subsidiaryToken2,
        this.pairData.token1,
        this.pairData.token0,
        this.pairData.token1,
        this.pairData.reserve0,
        this.pairData.reserve1,
        this.pairData.tokenDecimals0,
        this.pairData.tokenDecimals1
      );
      this.amount2 = this.connectionService.fromWei(this.longInputSecond.toString());
      // if (BigNumber.from(this.longInputSecond).gt(BigNumber.from(this.tokenSecondBalance))) {
        // this.error = true;
        // this.errorText = 'Insufficient Balance ' + '' + this.farm.subsidiaryTokenName2;
        // return
      // } else {
      //   this.error = false;
      // }
    }
    if (where === '2') {
      this.tradeType = 2;
      // if (BigNumber.from(this.inputSecond).gt(BigNumber.from(this.tokenSecondBalance))) {
      //   this.error = true;
      //   this.errorText = 'Insufficient Balance' + '' + this.farm.subsidiaryTokenName2;
      //   return
      // } else {
      //   this.error = false;
      // }
      this.longInputFirst = await this.dexService.getOtherAmountOfPairSwap(
        this.farm.address,
        this.inputSecond,
        // this.farm.subsidiaryToken1,
        this.pairData.token0,
        this.pairData.token0,
        this.pairData.token1,
        this.pairData.reserve0,
        this.pairData.reserve1,
        this.pairData.tokenDecimals0,
        this.pairData.tokenDecimals1
      );
      // this.amount1 =  this.longInputFirst.toString();
      this.amount1 = this.connectionService.fromWei(this.longInputFirst.toString());
      if (BigNumber.from(this.longInputFirst).gt(BigNumber.from((this.tokenFirstBalance)))) {
        this.error = true;
        this.errorText = 'Insufficient Balance ' + '' + this.farm.subsidiaryTokenName1;
        return;
      } else {
        this.error = false;
      }
    }
    if (
      this.tokenFirstBalance.toString() == '' ||
      this.tokenSecondBalance.toString() == ''
    ) {
      this.error = true;
      this.errorText = 'Insufficient balance in wallet';
      return;
    }

    // Calculate minReceived and priceImpact
    if (this.amount2 && !this.error) {
      const minDebt: number = 1000 - (this.slipTolerance) / 1000;
      const minDebtFx = FixedNumber.from(minDebt.toString());
      const amount2Wei = this.connectionService.toWei(this.amount2);
      const min = parseInt((FixedNumber.from(amount2Wei).mulUnsafe(minDebtFx)).toString()) / 1000;
      this.minimunReceived = this.connectionService.fromWei(min.toString());
      // Find out reserve of In
      let reserveFrom;
      if (this.dexService.compareEthAddr(this.farm.subsidiaryToken2, this.pairData.token0)) {
        reserveFrom = this.pairData.reserve0;
      } else {
        reserveFrom = this.pairData.reserve1;
      }
      if (this.amount1 != '' || '0' || undefined) this.priceImpact = await this.dexService.getPriceImpact(this.amount1, this.pairData.fee, FixedNumber.from(reserveFrom));
    }

  }

  checkIfSupplyIsDisabled(): boolean {
    let isInputFirstLessOrEqual =
      parseFloat(parseFloat(this.amount1).toFixed(18)) <= 0;
    let isInputSecondLessOrEqual =
      parseFloat(parseFloat(this.amount2).toFixed(18)) <= 0;
    let isInputFirstNull = this.amount1 == null;
    let isInputSecondNull = this.amount2 == null;
    let isError = this.error;
    let isNotApproved = !this.approvedPair;
    let isFirstBalanceLessThanInput = BigNumber.from(this.tokenFirstBalance).lt(
      BigNumber.from(this.amount1)
    );
    let isSecondBalanceLessThanInput = BigNumber.from(
      this.tokenSecondBalance
    ).lt(BigNumber.from(this.amount2));
    return (
      isInputFirstLessOrEqual ||
      isInputSecondLessOrEqual ||
      isInputFirstNull ||
      isInputSecondNull ||
      isError ||
      isNotApproved ||
      isFirstBalanceLessThanInput ||
      isSecondBalanceLessThanInput
    );
  }

  async approve(): Promise<void> {
    const deadline = Number(localStorage.getItem('transDeadLine')) * 60 + 120;
    const slippage = localStorage.getItem('slipTolerance');
    const userAddr = await this.connectionService.getWalletAddress();
    try {
      // Get slippage and deadline values
      // Deadline to seconds
      const receipt = await this.dexService.swapTokens(
        userAddr,
        this.tradeType,
        this.amount1,
        this.amount2,
        this.farm.subsidiaryToken1,
        this.farm.subsidiaryToken2,
        parseInt(slippage),
        deadline,
        this.walletTo ? this.walletTo : '0x'
      );
      // Only reset amounts, keep token selections

      this.tokenFirstBalance = await this.tokenService.getBalanceOfToken(
        this.farm.subsidiaryToken1
      );
      this.tokenSecondBalance = await this.tokenService.getBalanceOfToken(
        this.farm.subsidiaryToken2
      );
      await this.clearForm();
    } catch (error) {
      console.log(error);
    } finally {
      console.log('fin');
    }
  }

  async clearForm(): Promise<void> {
    this.amount1 = '';
    this.amount2 = '';
  }

  // async assignProductsToUsers(): Promise<void> {
  //   try {
  //     // Approve
  //     // Check that we have allowance of token. Eth does not need approve
  //      // await this.contractService.validateAllowance(this.tokenDataFrom, this.addresses.ROUTER, this.longInputFrom);
  //     // Get slippage and deadline values
  //     // Deadline to seconds
  //     const deadline = Number(this.transDeadLine) * 60;

  //     // Make the call depending on the swap type
  //     let receipt;
  //     // Exact From A > *B or A > *ETH or ETH > *A
  //     receipt = await this.dexService.swapExactAnyForAny(
  //       this.tradeType,
  //       this.longInputFirst,
  //       this.longInputSecond,
  //       this.farm.subsidiaryToken1,
  //       this.farm.subsidiaryToken2,
  //       this.slipTolerance,
  //       deadline,
  //       this.walletTo ? this.walletTo: '0x');
  //     // Only reset amounts, keep token selections
  //     await this.clearForm();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     console.log('fin');
  //   }

  // }
}
