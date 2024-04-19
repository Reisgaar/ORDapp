import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Pool } from 'src/app/interfaces/pool';
import { ApyComponent } from '../../defi-common/apy/apy.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { DexDialogService } from 'src/app/shared/services/dex-dialog.service';
import { allowances } from 'src/app/constants/allowances';
import { PopUpCustomAllowanceComponent } from '../../../allowance-manager/pop-up-custom-allowance/pop-up-custom-allowance.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-farm-card',
  templateUrl: './farm-card.component.html',
  styleUrls: ['./farm-card.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class FarmCardComponent implements OnInit, OnDestroy {
  @Input() pool: Pool;
  showDetDiv: boolean = false;
  isConnected: boolean = false;
  file: boolean;
  userAccount: string = '';
  allowances: any = allowances;
  interval: any;
  showPool: boolean = false;
  card: boolean = true;

  subscription1: Subscription = this.dexService.currentFile.subscribe((message: string) => {
    message == 'row'
      ? this.file = true
      : this.file = false
  });
  subscription2: Subscription = this.dexService.visible.subscribe((message: boolean) => {
    if (message) {
      if (this.pool.staked == '' || '0') {
        this.showPool = false;
      }
      if(parseFloat(this.pool.staked) > 0) { this.showPool = true}
    }
    if (!message) {
      this.showPool = true;
    }
  });


  constructor(
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private dexService: DexService,
    private tokenService: TokenService,
    private dexDialogService: DexDialogService
  ) {
  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.resizeWindow(window.innerWidth);
  }

  async ngOnInit(): Promise<any> {
    this.resizeWindow(window.innerWidth);
    await this.isConnectedWallet();
    await this.getPoolId(this.pool.farm, this.pool.address);
    await this.getInfo(this.pool.farm, this.pool.address);
    await this.getStakedTotal(this.pool.farm, this.pool.address);
    this.showPool = true;
    if (this.isConnected) {
      await this.getUserDataInterval();
    }
  }

  async isConnectedWallet(): Promise<any>{
    this.isConnected = await this.connectionService.isWalletConnected();
    this.isConnected
    ? this.userAccount =  this.connectionService.getWalletAddress()
    : this.userAccount = '';
  }

  resizeWindow(inner){
    console.log(inner);
    inner >= 1030 ? this.file = true : this.file = false;
  }

  async getPoolId(farm: string, address: string): Promise<any> {
    this.pool.id = await this.dexService.getPoolId(farm, address);
  }

  async getInfo(farm: string, address: string) {

    const functions = [
      { function: 'positionPoolsByLP', args: [address] },
      { function: 'resource', args: [] },
      { function: 'resourcePerBlock', args: [] },
      { function: 'poolInfo', args: [this.pool.id] },
      { function: 'totalAllocPoint', args: [] },
      { function: 'pendingResource', args: [this.pool.id, this.userAccount] },

    ];
    const info = await this.dexService.getInfo(farm, functions, 'farm');
    info[0].status === 'success'
      ? (this.pool.id = info[0].result.toString())
      : (this.pool.id = '');
    info[1].status === 'success'
      ? (this.pool.rewardToken = info[1].result)
      : (this.pool.rewardToken = '');
    info[2].status === 'success'
      ? (this.pool.resourcePerBlock = info[2].result.toString())
      : (this.pool.resourcePerBlock = '');
    if (info[3].status === 'success') {
      this.pool.stakedToken = info[3].result[0];
      this.pool.allocPoint = info[3].result[1];
    }
    info[4].status === 'success'
      ? (this.pool.totalAllocPoint = info[4].result.toString())
      : (this.pool.totalAllocPoint = '');
    info[5].status === 'success'
      ? (this.pool.pendingRewards = this.connectionService.fromWei(info[5].result.toString()))
      : (this.pool.pendingRewards = '');

    this.pool.stakedToken ? await this.getInfoLp(this.pool.stakedToken) : null;
    this.pool.rewardToken
      ? await this.getInfoRewardToken(this.pool.rewardToken)
      : null;
    this.pool.type = 'farm';
  }

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

  async getStakedTotal(farm: string, address: string): Promise<any> {
    this.pool.stakedTotal = await this.dexService.getStakedTotal(farm, address);
  }

  async getUserDataInterval(): Promise<any> {
    await this.getUserStakedData().then();
    this.interval = setInterval(async () => {
      await this.getUserStakedData();
    }, 10000);
  }
  async getUserStakedData(): Promise<any> {
    const allowance = await this.tokenService.getTokenAllowanceOnSpender(
      this.pool.address,
      this.pool.farm
    );
    if (allowance > 0) {
      await this.dexService
        .getUserStakedData(this.pool.farm, this.pool.id, this.userAccount)
        .then((res: any) => {
          this.pool.staked = res.amount;
          this.pool.isApproved = true;
        });
    }
  }

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  async customAllowance(): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      this.dialog
        .open(PopUpCustomAllowanceComponent, {
          panelClass: 'lootbox-dialog-container',
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            const amount = this.connectionService.toWei(res);
            this.changeAllowance(amount);
          }
        });
    }
  }

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  async changeAllowance(amount?: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      await this.tokenService
        .tokenApprove(this.pool.farm, this.pool.stakedToken, amount)
        .then(() => {
          this.getAllowances();
        });
    }
  }

  /**
   * Get and set all allowances of tokens in allowances constant
   */
  async getAllowances(): Promise<any> {
    // for (const [key1, section] of Object.entries(this.allowances)){
    //   for (const [key2, contract] of Object.entries(section['contracts'])){
    //     for (const [key3, token] of Object.entries(contract['allowedTokens'])) {
    if (await this.connectionService.isWalletConnected()) {
      // const tokenAddress = contractAddresses[token['constant']];
      // const contractAddress = contractAddresses[contract['addressConstant']];
      this.tokenService
        .getTokenAllowanceOnSpender(this.pool.stakedToken, this.pool.farm)
        .then((res) => {
          let allowed = this.connectionService.fromWei(res);
          if (parseFloat(allowed) > 0) {
            this.pool.isApproved = true;
          }
          if (parseFloat(allowed) == 0) {
            this.pool.isApproved = false;
          }
        });
    } else {
      // token['allowed'] = '';
    }
  }
  //     }
  //   }
  //   // console.log(this.allowances);
  // }

  /**
   * Claim the reward of the pool
   */
  async claimReward(): Promise<void> {
    await this.dexService.claim(this.pool.farm, this.pool.id);
    await this.getUserDataInterval();
  }

  /**
   * Withdraw from the pool
   */
  async withdraw(): Promise<void> {
    const data = {
      type: 'withdraw',
      pool: this.pool.address,
      staked: this.pool.staked,
      token0Symbol:  this.pool.subsidiaryTokenSymbol1,
      token1Symbol: this.pool.subsidiaryTokenSymbol2,
      address:this.pool.stakedToken,
      symbol: this.pool.stakedTokenSymbol
    }
    await this.dexDialogService
      .openWithdrawDialog(
        data
      )
      .afterClosed()
      .subscribe(async (res: any) => {
        try {
          const amount = res.toString();
          await this.dexService.withdraw(this.pool.farm, this.pool.id, amount);
        } catch (error: any) {}
      });
  }

  /**
   * Deposit lp to the pool
   */
  async deposit(): Promise<void> {
    await this.dexDialogService
      .openStakeDialog(
        'deposit',
        this.pool.address,
        this.pool.staked,
        this.pool.subsidiaryTokenSymbol1,
        this.pool.subsidiaryTokenSymbol2,
        this.pool.stakedToken,
        this.pool.stakedTokenSymbol
      )
      .afterClosed()
      .subscribe(async (res: any) => {
        try {
          const amount = res.toString();
          await this.dexService.deposit(
            this.pool.farm,
            this.pool.id,
            this.pool.stakedToken,
            amount
          );
        } catch (error: any) {}
      });
  }

  showDetails() {
    this.showDetDiv = !this.showDetDiv;
  }

  apy() {
    console.log('data',this.pool,
      this.pool.resourcePerBlock,
      this.pool.totalAllocPoint,
       this.pool.rewardTokenName,

       this.pool.address,
       this.isConnected,
       this.pool.stakedToken,
       this.pool.staked,
       this.pool.stakedTotal,
       this.pool.stakedTokenDecimals,
       this.pool.pendingRewards,
       this.pool.rewardTokenSymbol,
       this.pool.farm)
    const dialogRef = this.dialog.open(ApyComponent, {
      panelClass: 'lootbox-dialog-container',
      data: {
        // type: 'farm',
        id: this.pool.id,
        resourcePerBlock: this.pool.resourcePerBlock,
        totalAllocPoint: this.pool.totalAllocPoint,
        rewardTokenName: this.pool.rewardTokenName,

        address: this.pool.address,
        isConnected: this.isConnected,
        token: this.pool.stakedToken,
        staked: this.pool.staked,
        stakedTotal: this.pool.stakedTotal,
        stakedTokenDecimals: this.pool.stakedTokenDecimals,
        pendingRewards: this.pool.pendingRewards,
        rewardTokenSymbol: this.pool.rewardTokenSymbol,
        pool: this.pool,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  /**
   * Set token on metamask
   */
  async setTokenOnMetamask(token, tokenSymbol, decimals, img): Promise<void> {
    await this.connectionService.setTokenOnMetamask(
      'ERC20',
      token,
      tokenSymbol,
      decimals,
      img
    );
  }
}
