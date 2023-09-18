import { Injectable } from '@angular/core';
import { BigNumber, FixedNumber, ethers } from 'ethers';
import { dexDataConstants } from 'src/app/constants/dexDataConstants';
import { Pool } from 'src/app/interfaces/pool';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { waitForTransaction } from '@wagmi/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';

// Abi
import { default as farm } from 'src/app/shared/contracts/dex/farm.json';
import { default as pairLp } from 'src/app/shared/contracts/dex/pairLp.json';
import { default as BEP20 } from 'src/app/shared/contracts/token/BEP20.json';
import { default as alliStake } from 'src/app/shared/contracts/dex/alliStake.json';
import { default as stake } from 'src/app/shared/contracts/dex/Stake.json';
import { default as galacticReserve } from 'src/app/shared/contracts/dex/galacticReserve.json';
import { default as router } from 'src/app/shared/contracts/dex/UniswapV2Router02.json';

import { TokenService } from '../token/token.service';
import { BehaviorSubject } from 'rxjs';
import { LiquidityValue } from 'src/app/interfaces/liquidity-value';
import {
  gqPriceOnBusd,
  bnbPriceOnBusd,
  ipxPriceOnBusd,
  sckPriceOnBusd,
  cpoPriceOnBusd,
} from 'src/app/constants/pricesOnBusd';
import { OracleApiService } from '../oracle-api.service';

@Injectable({
  providedIn: 'root',
})
export class DexService {
  pools: Pool[] = [];
  abi: any;
  private typeOfPool = new BehaviorSubject<string>('');
  currentPool = this.typeOfPool.asObservable();
  // private poolFilter = new BehaviorSubject<string>('');
  // currentPoolFilter = this.poolFilter.asObservable();

  private isVisible = new BehaviorSubject<boolean>(false);
  visible = this.isVisible.asObservable();
  private file = new BehaviorSubject<string>('row');
  currentFile = this.file.asObservable();
  private ended = new BehaviorSubject<boolean>(true);
  currentEnded = this.ended.asObservable();
  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private tokenService: TokenService,
    private oracleApiService: OracleApiService
  ) {
    this.fillPools();
  }

  /**
   *
   * @param type
   */
  changePoolType(type: string) {
    this.typeOfPool.next(type);
  }

  /**
   *
   * @param visible
   */
  setVisible(visible: boolean) {
    this.isVisible.next(visible);
  }

  /**
   *
   * @param ended
   */
  setActivePools(ended: boolean) {
    this.ended.next(ended);
  }

  /**
   *
   * @param type
   */
  setFile(file: string) {
    this.file.next(file);
  }

  //     /**
  //  *
  //  * @param type
  //  */
  //     setPoolFilter(file: string) {
  //       this.poolFilter.next(file);
  //     }

  /**
   * Fills basic data for each pools pool in our constants
   */
  async fillPools(): Promise<Pool[]> {
    dexDataConstants.forEach(async (pool) => {
      this.pools.push({
        id: '',
        address: pool.address,
        allocPoint: '',
        allowance: false,
        totalAllocPoint: '',
        lockupDuration: NaN,
        timeLockup: NaN,
        stakedToken: '',
        stakedTokenSymbol: '',
        stakedTokenName: '',
        stakedTokenImg: pool.stakedTokenImg,
        stakedTokenDecimals: NaN,
        subsidiaryToken1: '',
        subsidiaryTokenSymbol1: pool.subsidiaryTokenSymbol1,
        subsidiaryTokenName1: '',
        subsidiaryTokenImg1: pool.subsidiaryTokenImg1,
        subsidiaryTokenDecimals1: NaN,
        subsidiaryToken2: '',
        subsidiaryTokenSymbol2: pool.subsidiaryTokenSymbol2,
        subsidiaryTokenName2: '',
        subsidiaryTokenImg2: pool.subsidiaryTokenImg2,
        subsidiaryTokenDecimals2: NaN,
        subsidiaryTokenReserve1: '',
        subsidiaryTokenReserve2: '',
        resourcePerBlock: '',
        rewardToken: '',
        rewardTokenSymbol: '',
        rewardTokenName: '',
        rewardTokenImg: pool.rewardTokenImg,
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
        // multiplier: pool.multiplier,
        type: pool.type,
        factory: pool.factory,
        liquidityData: 0,
        hasLimit: false,
        farm: pool.farm,
        // rewardTokenImg1: '',
        // rewardTokenImg2: '',
      });
    });
    return this.pools;
  }

  async getPools(): Promise<Pool[]> {
    return this.pools;
  }

  async getPoolId(farmAddress: string, address: string): Promise<any> {
    const data = await this.connectionService.readContract(
      farmAddress,
      farm.abi,
      'positionPoolsByLP',
      [address]
    );
    return data;
  }

  async getRewardToken(farmAddress: string): Promise<any> {
    const data = await this.connectionService.readContract(
      farmAddress,
      farm.abi,
      'resource',
      []
    );
    return data;
  }

  async getStakedTotal(farm: string, address: string): Promise<any> {
    const dataWei = await this.connectionService.readContract(
      address,
      pairLp.abi,
      'balanceOf',
      [farm]
    );
    const data = this.connectionService.fromWei(dataWei);
    return data;
  }

  async getInfo(farmAddress: string, functions: any[], type): Promise<any> {
    type === 'lp' ? (this.abi = pairLp.abi) : null;
    type === 'farm' ? (this.abi = farm.abi) : null;
    type === 'token' ? (this.abi = BEP20.abi) : null;
    const wagmiContract = {
      address: farmAddress,
      abi: this.abi,
    };
    const contracts = functions.map((element) => {
      let mc = {
        ...wagmiContract,
        functionName: element.function,
        args: element.args,
      };
      return mc;
    });
    const data = await this.connectionService.multicall(contracts);
    return data;
  }

  async balanceOf(address): Promise<any> {
    const wallet = this.connectionService.getWalletAddress();
    const data = await this.connectionService.readContract(
      address,
      pairLp.abi,
      'balanceOf',
      [wallet]
    );
    return data;
  }

  async getUserStakedData(
    farmAddress: string,
    pool: string | void,
    user: string
  ): Promise<any> {
    const dataWei = await this.connectionService.readContract(
      farmAddress,
      farm.abi,
      'userInfo',
      [pool, user]
    );
    const amount = this.connectionService.fromWei(dataWei.amount);
    const rewardDebt = this.connectionService.fromWei(dataWei.rewardDebt);
    const data = { amount: amount, rewardDebt: rewardDebt };
    return data;
  }

  async claim(address: string, pid: string | void): Promise<void> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog(
        'actionNeeded',
        'confirmHarvestTransaction',
        ''
      );
      try {
        const tx = await this.connectionService.writeContract(
          address,
          farm.abi,
          'deposit',
          [pid, 0]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitHarvest',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitHarvest',
          'successfulTransaction',
          ''
        );
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'error',
          error.message,
          ''
        );
      }
    }
  }

  async withdraw(
    poolFarm: string,
    pool: string | void,
    amount: string
  ): Promise<void> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const amountWei = this.connectionService.toWei(amount);
      let dialog = this.dialogService.openRegularInfoDialog(
        'actionNeeded',
        'confirmWithdrawTransaction',
        ''
      );
      try {
        const tx = await this.connectionService.writeContract(
          poolFarm,
          farm.abi,
          'withdraw',
          [pool, amountWei]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitWithdraw',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitWithdraw',
          'successfulTransaction',
          ''
        );
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'error',
          error.message,
          ''
        );
      }
    }
  }

  /**
   * Deposits on the pool
   * @param {number} pool : number of the pool
   * @param {string} amount : amount of GQ to deposit
   * @returns {any} : the deposit function
   */
  async deposit(
    poolFarm: string,
    poolId: string | void,
    stakedToken: string,
    amount: string
  ): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const amountWei = this.connectionService.toWei(amount);
      const allowed = await this.tokenService.tokenApprovement(
        poolFarm,
        userAddr,
        stakedToken,
        amountWei
      );
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog(
          'actionNeeded',
          'confirmDepositTransaction',
          ''
        );
        try {
          const tx = await this.connectionService.writeContract(
            poolFarm,
            farm.abi,
            'deposit',
            [poolId, amountWei]
          );
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'waitDeposit',
            'waitTransaction',
            ''
          );
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'waitDeposit',
            'successfulTransaction',
            ''
          );
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'error',
            error.message,
            ''
          );
        }
      }
    }
  }

  async getLockUpDuration(address: string): Promise<any> {
    const data = await this.connectionService.readContract(
      address,
      alliStake.abi,
      'lockUpDuration',
      []
    );
    return data;
  }

  async getFee(address: string): Promise<any> {
    const data = this.connectionService.readContract(
      address,
      alliStake.abi,
      'withdrawFee',
      []
    );
    return data;
  }

  async getSwapFee(address: string): Promise<any> {
    const data = this.connectionService.readContract(
      address,
      pairLp.abi,
      'fee',
      []
    );
    return data;
  }

  async getUserPoolStakedData(
    pool: string,
    user: string,
    type: string
  ): Promise<any> {
    if (type == 'GalacticAlliance') {
      let abi = alliStake.abi;
      const dataWei = await this.connectionService.readContract(
        pool,
        abi,
        'userInfo',
        [user]
      );
      return dataWei;
    }
    if (type == 'Stake') {
      let abi = stake.abi;
      const dataWei = await this.connectionService.readContract(
        pool,
        abi,
        'userInfo',
        [user]
      );
      return dataWei;
    }

    if (type == 'GalacticReserve') {
      let abi = galacticReserve.abi;
      const dataWei = await this.connectionService.readContract(
        pool,
        abi,
        'userInfo',
        [user]
      );
      return dataWei;
    }
  }

  async getPendingRewards(
    address: string,
    user: string,
    type: string,
    token0: string,
    token1?: string
  ): Promise<any> {
    if (type == 'GalacticAlliance') {
      let abi = alliStake.abi;
      let dataWei0 = await this.connectionService.readContract(
        address,
        abi,
        'pendingReward',
        ['1', user]
      );
      if (token1) {
        let dataWei1 = await this.connectionService.readContract(
          address,
          abi,
          'pendingReward',
          ['2', user]
        );
        return { dataWei0: dataWei0, dataWei1: dataWei1 };
      }
      return { dataWei0: dataWei0 };
    }
    if (type !== 'GalacticAlliance') {
      let abi = stake.abi;
      let dataWei0 = await this.connectionService.readContract(
        address,
        abi,
        'pendingReward',
        [user]
      );
      return { dataWei0: dataWei0 };
    }
  }

  async withdrawPool(pool: string, amount: string): Promise<void> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const amountWei = this.connectionService.toWei(amount);
      let dialog = this.dialogService.openRegularInfoDialog(
        'actionNeeded',
        'confirmWithdrawTransaction',
        ''
      );
      try {
        const tx = await this.connectionService.writeContract(
          pool,
          alliStake.abi,
          'withdraw',
          [amountWei]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitWithdraw',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitWithdraw',
          'successfulTransaction',
          ''
        );
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'error',
          error.message,
          ''
        );
      }
    }
  }

  /**
   * Deposits on the pool
   * @param {number} pool : number of the pool
   * @param {string} amount : amount of GQ to deposit
   * @returns {any} : the deposit function
   */
  async depositPool(
    pool: string,
    stakedToken: string,
    amount: string
  ): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const amountWei = this.connectionService.toWei(amount);
      const allowed = await this.tokenService.tokenApprovement(
        pool,
        userAddr,
        stakedToken,
        amountWei
      );
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog(
          'actionNeeded',
          'confirmDepositTransaction',
          ''
        );
        try {
          const tx = await this.connectionService.writeContract(
            pool,
            alliStake.abi,
            'deposit',
            [amountWei]
          );
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'waitDeposit',
            'waitTransaction',
            ''
          );
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'waitDeposit',
            'successfulTransaction',
            ''
          );
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog(
            'error',
            error.message,
            ''
          );
        }
      }
    }
  }

  /**
   * Deposits on the pool
   * @param {number} pool : number of the pool
   * @param {string} amount : amount of GQ to deposit
   * @returns {any} : the deposit function
   */
  async claimPool(pool: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog(
        'actionNeeded',
        'confirmHarvestTransaction',
        ''
      );
      try {
        const tx = await this.connectionService.writeContract(
          pool,
          alliStake.abi,
          'deposit',
          [0]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitHarvest',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitHarvest',
          'successfulTransaction',
          ''
        );
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'error',
          error.message,
          ''
        );
      }
    }
  }

  async getPoolStakedTotal(token: string, address: string): Promise<any> {
    const dataWei = await this.connectionService.readContract(
      token,
      BEP20.abi,
      'balanceOf',
      [address]
    );
    const data = this.connectionService.fromWei(dataWei);
    return data;
  }

  // Add liquidity

  async getPairData(
    pairAddr: string,
    tokenA: string,
    tokenB: string
    // tokenADecimals:number,
    // tokenBDecimals:number
  ): Promise<any> {
    try {
      // await this.connService.syncAccount();
      // Validate if pair exists
      if (pairAddr === '0x0000000000000000000000000000000000000000') {
        return {
          reserve0: BigNumber.from(0),
          reserve1: BigNumber.from(0),
          token0: '0x0000000000000000000000000000000000000000',
          token1: '0x0000000000000000000000000000000000000000',
          addr: '0x0000000000000000000000000000000000000000',
          fee: 0,
        };
      }
      // const pair = new this.connService.web3js.eth.Contract(PairAbi.abi, pairAddr);
      let fee;
      try {
        fee = await this.connectionService.readContract(
          pairAddr,
          pairLp.abi,
          'fee',
          []
        );
      } catch (error) {
        fee = 3;
      }
      const reserves = await this.connectionService.readContract(
        pairAddr,
        pairLp.abi,
        'getReserves',
        []
      );
      const token0 = await this.connectionService.readContract(
        pairAddr,
        pairLp.abi,
        'token0',
        []
      );
      console.log('token0 ', token0, tokenA);
      if (token0 == tokenA) {
        const reserve0: BigNumber = reserves._reserve0;
        const reserve1: BigNumber = reserves._reserve1;
        return {
          reserve0: reserve0,
          reserve1: reserve1,
          token0: tokenA,
          token1: tokenB,
          addr: pairAddr,
          // tokenDecimals0: reserves.tokenDecimals0,
          // tokenDecimals1: reserves.tokenDecimals1,
          fee: Number(fee),
        };
      }
      if (token0 != tokenA) {
        const reserve0: BigNumber = reserves._reserve1;
        const reserve1: BigNumber = reserves._reserve0;
        return {
          reserve0: reserve0,
          reserve1: reserve1,
          token0: tokenB,
          token1: tokenA,
          addr: pairAddr,
          // tokenDecimals0: reserves.tokenDecimals1,
          // tokenDecimals1: reserves.tokenDecimals0,
          fee: Number(fee),
        };
      }
    } catch (e) {
      return {
        reserve0: BigNumber.from(0),
        reserve1: BigNumber.from(0),
        token0: '',
        token1: '',
        addr: '',
        fee: 0,
      };
    }
  }

  async getOtherAmountOfPair(
    //TODO same in liquidity, not swap
    address: string,
    amount: any,
    token: string,
    token0: string,
    token1: string,
    reserve0: BigNumber,
    reserve1: BigNumber
  ) {
    // Identify which token of the pair
    const bnFix0 = ethers.FixedNumber.from(reserve0);
    const bnFix1 = ethers.FixedNumber.from(reserve1);

    if (this.compareEthAddr(token, token0) == true) {
      const result: FixedNumber = bnFix0.divUnsafe(bnFix1);
      return amount.mulUnsafe(result);
    }
    if (this.compareEthAddr(token, token1) == true) {
      const result: FixedNumber = bnFix1.divUnsafe(bnFix0);
      return amount.mulUnsafe(result);
    } else {
      // This should never reach
      throw Error('token does not exist in pair');
    }
  }

  async getOtherAmountOfPairSwap(
    //TODO same in liquidity, not swap
    address: string,
    amount: FixedNumber,
    token: string,
    token0: string,
    token1: string,
    reserve0: BigNumber,
    reserve1: BigNumber,
    tokenDecimals0: number,
    tokenDecimals1: number
  ) {
    if (this.compareEthAddr(token, token1) == true) {
      console.log('compare token1');
      const reserve0Fx = FixedNumber.from(reserve0);
      const reserve1Fx = FixedNumber.from(reserve1);
      const amountFx = FixedNumber.from(amount);
      const fee = await this.getSwapFee(address);
      const feeAmount = amountFx.mulUnsafe(FixedNumber.from(1000 - fee));
      const aOut: FixedNumber = feeAmount
        .mulUnsafe(reserve1Fx)
        .divUnsafe(
          reserve0Fx.mulUnsafe(FixedNumber.from(1000)).addUnsafe(feeAmount)
        );
      const round = Math.pow(10, tokenDecimals1);

      const aOutFixRound = aOut.divUnsafe(FixedNumber.from(round.toString()));

      if (parseFloat(aOut._value) > parseFloat(reserve0Fx._value)) {
        return FixedNumber.from(0);
      }
      return FixedNumber.from(aOutFixRound, 0);
    }

    if (this.compareEthAddr(token, token0) == true) {
      console.log('compare token0');

      const fee = await this.getSwapFee(address);
      const reserve0Fx = FixedNumber.from(reserve0);
      const reserve1Fx = FixedNumber.from(reserve1);
      const amountFx = FixedNumber.from(amount);
      const num = reserve0Fx
        .mulUnsafe(amountFx)
        .mulUnsafe(FixedNumber.from(1000));
      const inBn = num.divUnsafe(
        reserve1Fx.subUnsafe(amountFx).mulUnsafe(FixedNumber.from(1000 - fee))
      );
      const round = Math.pow(10, tokenDecimals0);
      const aInFixRound = inBn.divUnsafe(FixedNumber.from(round.toString()));
      return FixedNumber.from(aInFixRound, 0);
    } else {
      throw Error('token does not exist in pair');
    }
  }

  // Compare two ETH addresses
  compareEthAddr(A: string, B: string): boolean {
    return A.toLowerCase() === B.toLowerCase();
  }

  validateInput(input: string): boolean {
    const inputNumber = parseFloat(input);
    const isNaN = Number.isNaN(inputNumber);
    if (isNaN || inputNumber <= 0) {
      return false;
    }
    return true;
  }

  async addLiquidityAny(
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string,
    slippage: number,
    deadline: number,
    userAddr: string
    // isETH: boolean
  ): Promise<any> {
    console.log('slippage', slippage);

    const amountABN = FixedNumber.from(amountA);
    let minA = await this.connectionService.toWei(
      amountABN
        .mulUnsafe(FixedNumber.from(100 - slippage))
        .divUnsafe(FixedNumber.from(100))
        .toString()
    );
    const amountBBN = FixedNumber.from(amountB);
    let minB = await this.connectionService.toWei(
      amountBBN
        .mulUnsafe(FixedNumber.from(100 - slippage))
        .divUnsafe(FixedNumber.from(100))
        .toString()
    );
    console.log(amountABN.toString(), amountA);
    const allow1 = await this.tokenService.getTokenAllowanceOnSpender(
      tokenA,
      contractAddresses.ROUTER
    );
    console.log('allow1', allow1, minA);
    const allow2 = await this.tokenService.getTokenAllowanceOnSpender(
      tokenB,
      contractAddresses.ROUTER
    );
    console.log('allow2', allow2, minB);

    const allowance1 = await this.tokenService.checkApproved(
      contractAddresses.ROUTER,
      userAddr,
      tokenA,
      this.connectionService.toWei(amountA)
    );
    const allowance2 = await this.tokenService.checkApproved(
      contractAddresses.ROUTER,
      userAddr,
      tokenB,
      this.connectionService.toWei(amountB)
    );
    let confirm1: boolean;
    let confirm2: boolean;
    console.log('allowance', allowance1, allowance2);
    if (!allowance1) {
      confirm1 = await this.tokenService.tokenApprove(
        contractAddresses.ROUTER,
        tokenA,
        this.connectionService.toWei(amountA)
      );
    } else {
      confirm1 = true;
    }
    if (!allowance2) {
      confirm2 = await this.tokenService.tokenApprove(
        contractAddresses.ROUTER,
        tokenB,
        this.connectionService.toWei(amountB)
      );
    } else {
      confirm2 = true;
    }
    console.log('confirm', confirm1, confirm2);

    if (confirm1 && confirm2) {
      try {
        const block: BigNumber = await this.connectionService.blockNumber();
        const lastBlockTimestamp: any =
          await this.connectionService.getBlockTimestamp(block.toString());

        const timestamp = lastBlockTimestamp.timestamp + deadline + 120;

        const tx = await this.connectionService.writeContract(
          contractAddresses.ROUTER,
          router.abi,
          'addLiquidity',
          [
            tokenA,
            tokenB,
            this.connectionService.toWei(amountA),
            this.connectionService.toWei(amountB),
            minA,
            minB,
            this.connectionService.getWalletAddress(),
            timestamp,
          ]
        );

        let dialogRef = this.dialogService.openRegularInfoDialog(
          'addLiquidity',
          'waitTransaction',
          ''
        );
        await waitForTransaction({ hash: tx.hash });
        dialogRef.close();
      } catch (error: any) {
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
      return true;
    }
  }

  getPriceImpact(
    amountIn: FixedNumber,
    fee: number,
    reserveIn: FixedNumber
  ): any {
    const feeToPI = (100 - fee) / 100;
    const pI = amountIn
      .mulUnsafe(FixedNumber.from(feeToPI.toString()))
      .divUnsafe(reserveIn)
      .mulUnsafe(FixedNumber.from(100));
    const pINunber = pI.toUnsafeFloat().toFixed(3);
    return pINunber;
  }

  public async swapTokens(
    tradeType: number,
    amountIn: string,
    amountOut: string,
    tokenIn: string,
    tokenOut: string,
    slippage: number,
    deadline: number,
    walletTo: string
  ): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog(
      'actionNeeded',
      'confirmSwap',
      ''
    );
    try {
      const am = (parseFloat(amountOut) * (1000 - slippage)) / 1000;
      const amountOutBn = BigNumber.from(
        this.connectionService.toWei(amountOut)
      );
      const slipOut = amountOutBn.mul(1000 - slippage).div(1000);
      const inmax = (parseFloat(amountIn) * (1000 + slippage)) / 1000;
      const block: BigNumber = await this.connectionService.blockNumber();
      const lastBlockTimestamp: any =
        await this.connectionService.getBlockTimestamp(block.toString());

      const timestamp = lastBlockTimestamp.timestamp + deadline + 120;

      let wallet = '';
      walletTo == '0x'
        ? (wallet = this.connectionService.getWalletAddress())
        : (wallet = walletTo);

      if (tradeType === 1) {
        const tx = await this.connectionService.writeContract(
          contractAddresses.ROUTER,
          router.abi,
          'swapExactTokensForTokens',
          [
            this.connectionService.toWei(amountIn.toString()),
            slipOut.toString(),
            [tokenIn, tokenOut],
            wallet,
            timestamp,
          ]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitSwap',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitSwap',
          'successfulTransaction',
          '',
          'successfulTransactionLink_html',
          tx.hash
        );
      }
      if (tradeType === 2) {
        const tx = await this.connectionService.writeContract(
          contractAddresses.ROUTER,
          router.abi,
          'swapTokensForExactTokens',
          [
            this.connectionService.toWei(inmax.toString()),
            this.connectionService.toWei(amountOut.toString()),
            [tokenIn, tokenOut],
            wallet,
            timestamp,
          ]
        );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitSwap',
          'waitTransaction',
          ''
        );
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog(
          'waitSwap',
          'successfulTransaction',
          '',
          'successfulTransactionLink_html',
          tx.hash
        );
      }
    } catch (error: any) {
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog(
        'error',
        error.message,
        ''
      );
    }
  }

  async estimateLiquidityValue(
    address,
    reserve0,
    reserve1,
    liquidityUser
  ): Promise<any> {
    const supply: BigNumber = await this.connectionService.readContract(
      address,
      pairLp.abi,
      'totalSupply',
      []
    );

    const ownership: FixedNumber = liquidityUser.divUnsafe(
      FixedNumber.from(supply.toString())
    );
    const token0Reserve = FixedNumber.from(
      this.connectionService.fromWei(reserve0)
    );
    const token1Reserve = FixedNumber.from(
      this.connectionService.fromWei(reserve1)
    );
    const amount0: FixedNumber = token0Reserve.mulUnsafe(ownership);
    const amount1: FixedNumber = token1Reserve.mulUnsafe(ownership);
    console.log(
      address,
      reserve0,
      reserve1,
      liquidityUser,
      ownership,
      token0Reserve,
      amount0
    );
    return { amount0: amount0, amount1: amount1 };
  }

  public async removeLiquidityAny(
    liquidityAmount: string,
    slippage: number,
    deadline: number,
    liquidityValue: LiquidityValue,
    tokenA,
    tokenB,
    userAddr,
    pairAddress
  ): Promise<any> {

    const minA: FixedNumber = liquidityValue.amount0
      .mulUnsafe(FixedNumber.from(1000 - slippage))
      .divUnsafe(FixedNumber.from(1000));
    const minB: FixedNumber = liquidityValue.amount1
      .mulUnsafe(FixedNumber.from(1000 - slippage))
      .divUnsafe(FixedNumber.from(1000));
    const minAWei = this.connectionService.toWei(minA._value);
    const minBWei = this.connectionService.toWei(minB._value);
    // const weiToRemove = this.connectionService.fromWei(
    //   parseInt(liquidityAmount._value).toString()
    // );
    // const liquidityAmountWei = this.connectionService.toWei(
    //   parseFloat(weiToRemove).toFixed(18)
    // );
    // console.log('value', weiToRemove, liquidityAmountWei);
    const block: BigNumber = await this.connectionService.blockNumber();
    const lastBlockTimestamp: any =
      await this.connectionService.getBlockTimestamp(block.toString());
    const wallet = this.connectionService.getWalletAddress();
    const timestamp = lastBlockTimestamp.timestamp + deadline + 120;

    const allow1 = await this.tokenService.getTokenAllowanceOnSpender(
      tokenA,
      contractAddresses.ROUTER
    );
    console.log('allow1', allow1, minA, minAWei);
    const allow2 = await this.tokenService.getTokenAllowanceOnSpender(
      tokenB,
      contractAddresses.ROUTER
    );
    const allowPair = await this.tokenService.getTokenAllowanceOnSpender(
      pairAddress,
      contractAddresses.ROUTER
    );
    console.log('allow2', allow2, minB, minBWei, liquidityAmount, allowPair);

    const allowance1 = await this.tokenService.checkApproved(
      contractAddresses.ROUTER,
      userAddr,
      tokenA,
      minAWei
    );
    const allowance2 = await this.tokenService.checkApproved(
      contractAddresses.ROUTER,
      userAddr,
      tokenB,
      minBWei
    );
    const allowancePair = await this.tokenService.checkApproved(
      contractAddresses.ROUTER,
      userAddr,
      pairAddress,
      liquidityAmount
    )
    let confirm1: boolean;
    let confirm2: boolean;
    let confirmAllowancePair: boolean;
    console.log('allowance', allowance1, allowance2, confirmAllowancePair);
    if (!allowance1) {
      confirm1 = await this.tokenService.tokenApprove(
        contractAddresses.ROUTER,
        tokenA,
        minAWei
      );
    } else {
      confirm1 = true;
    }
    if (!allowance2) {
      confirm2 = await this.tokenService.tokenApprove(
        contractAddresses.ROUTER,
        tokenB,
        minBWei
      );
    } else {
      confirm2 = true;
    }

    if (!allowancePair) {
      confirmAllowancePair = await this.tokenService.tokenApprove(
        contractAddresses.ROUTER,
        pairAddress,
        liquidityAmount
      );
    } else {
      confirmAllowancePair = true;
    }
    console.log('confirm', confirm1, confirm2);

    if (confirm1 && confirm2 && confirmAllowancePair) {
      console.log( 'transaction ',tokenA,
        tokenB,
        liquidityAmount,
        minAWei,
        minBWei,
        wallet,
        timestamp,)
      try {
        let dialogRef = this.dialogService.openRegularInfoDialog(
          'addLiquidity',
          'waitTransaction',
          ''
        );
        const tx = await this.connectionService.writeContract(
          contractAddresses.ROUTER,
          router.abi,
          'removeLiquidity',
          [
            tokenA,
            tokenB,
            liquidityAmount,
            minAWei,
            minBWei,
            wallet,
            timestamp,
          ]
        );

        await waitForTransaction({ hash: tx.hash });
        dialogRef.close();
      } catch (error: any) {
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
      return true;
    }
  }

  async getStakeRewardPerBlock(pool: string, token?: string): Promise<any> {
    if (token)
      return await this.connectionService.readContract(
        pool,
        alliStake.abi,
        'mapOfRewardPerBlock',
        [token]
      );
    if (!token)
      return await this.connectionService.readContract(
        pool,
        stake.abi,
        'rewardPerBlock',
        []
      );
  }

  /**
   * Get token price in dolars. If is GQ from Coingecko else get LP token price.
   */
  async tokenPrice(pool, token?: string): Promise<number> {
    if (
      pool.stakedToken.address.toLowerCase() ==
      contractAddresses.gq.toLowerCase()
    )
      token = pool.stakedToken.address;
    if (!pool.stakedToken.LPToken) {
      const price = await this.getUnitTokenPrice(token);
      console.log(price);
      return price;
    }
    if (pool.stakedToken.LPToken.id) {
      // await this.getPairData(pool.stakedToken.address,pool.stakedToken.LPToken.token0,pool.stakedToken.LPToken.token1)
      //   .then(async (arg:any) => {
      const lpReserves = await this.connectionService.readContract(
        pool.stakedToken.address,
        pairLp.abi,
        'getReserves',
        []
      );
      const priceToken0 = await this.getUnitTokenPrice(
        pool.stakedToken.LPToken.token0
      );
      const priceToken1 = await this.getUnitTokenPrice(
        pool.stakedToken.LPToken.token1
      );
      const totalSuply = await this.connectionService.readContract(
        pool.stakedToken.address,
        pairLp.abi,
        'totalSupply',
        []
      );

      const token0Total: string = this.connectionService.fromWei(
        lpReserves._reserve0
      );
      const token1Total: string = this.connectionService.fromWei(
        lpReserves._reserve1
      );
      const totalLp =
        priceToken0 * parseFloat(token0Total) +
        priceToken1 * parseFloat(token1Total);
      const priceLp =
        totalLp / parseFloat(this.connectionService.fromWei(totalSuply));
      // const totalValueLp = priceLp * this.data.totalStaked;
      return priceLp;
      // });
    }
  }

  async getUnitTokenPrice(address: string) {
    if (address.toLowerCase() == contractAddresses.ipx.toLowerCase())
      return ipxPriceOnBusd[0];
    if (address.toLowerCase() == contractAddresses.gq.toLowerCase()) {
      console.log('gq price', gqPriceOnBusd[0]);
      return gqPriceOnBusd[0];
    }
    if (address.toLowerCase() == contractAddresses.sck.toLowerCase()) {
      return sckPriceOnBusd[0];
    }
    if (address.toLowerCase() == contractAddresses.cpo.toLowerCase()) {
      return cpoPriceOnBusd[0];
    }

    if (address.toLowerCase() == contractAddresses.busd.toLowerCase()) return 1;
  }

  setTokenPricesOnBusd() {
    if (gqPriceOnBusd[0]) {
      return;
    }
    /**
     * Gets the prices of BNB and GQ on BUSD
     */
    this.oracleApiService.getTokenPricesOnUsdDex()?.subscribe((res: any) => {
      bnbPriceOnBusd[0] = res.binancecoin.usd;
      gqPriceOnBusd[0] = res['outer-ring'].usd;
      ipxPriceOnBusd[0] = res['inpulse-x-2'].usd;
      sckPriceOnBusd[0] = res['space-corsair-key'].usd;
      cpoPriceOnBusd[0] = res['cryptopolis'].usd;
    });
  }
}
