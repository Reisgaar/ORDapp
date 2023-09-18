import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { Subscription, interval } from 'rxjs';
import { DexDialogService } from 'src/app/shared/services/dex-dialog.service';
import { allowances } from 'src/app/constants/allowances';
import { PopUpCustomAllowanceComponent } from '../../allowance-manager/pop-up-custom-allowance/pop-up-custom-allowance.component';
import { PoolsTotal } from 'src/app/interfaces/pools-total';
import { ApyComponent } from '../defi-common/apy/apy.component';

@Component({
  selector: 'app-pool-card',
  templateUrl: './pool-card.component.html',
  styleUrls: ['./pool-card.component.scss'],
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
  ]
})

export class PoolCardComponent implements OnInit, OnDestroy {

  @Input() pool: PoolsTotal;
  @Input() mode: string;
  showDetDiv: boolean = false;
  isConnected: boolean = false;
  file: boolean = true;
  userAccount: string = '';
  allowances: any = allowances;
  interval: any;
  intervalTime: any;
  showPool: boolean = true;
  lockupDuration: string = '';
  actualBlockNumber: string = '';
  hasStarted: boolean;
  hasEnded: boolean;
  withdrawFee: number;
  fee: number;
  subscription1: Subscription = this.dexService.currentFile.subscribe((message: string) => {
    message == 'row'
      ? this.file = true
      : this.file = false
  });
  subscription2: Subscription = this.dexService.visible.subscribe((message: boolean) => {
    if (message) {
      if (this.stakedOwn == '' || '0') {
        this.showPool = false;
      }
      if(parseFloat(this.stakedOwn) > 0) { this.showPool = true}
    }
    if (!message) {
      this.showPool = true;
    }
  });
  staked: string = '';
  pendingRewards1: string = '';
  pendingRewards2: string = '';
  firstDeposit: string = '';
  isApproved:boolean = false;
  stakedOwn: string = '';
  dateToWithdraw: number;
  today: number = new Date().getTime() / 1000;;
  canWithdraw: boolean = false;
  percentajeToWithdraw: number = NaN;
  days: number;
  minutes: number;
  hours: number;
  seconds: number;
  fileImg: string = 'assets/images/defi/';
  blocksToEnd: number;
  blockToStart: number;
  linkNetwork:string = 'https://bscscan.com/block/countdown/';

  // subsciptionVisible = this.dexService.visible.subscribe()

  constructor(
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private dexService: DexService,
    private tokenService: TokenService,
    private dexDialogService: DexDialogService
  ) { }

  // @HostListener('window:resize', ['$event'])
  // onResize(event): void {
  //   this.resizeWindow(window.innerWidth);
  // }
  // resizeWindow(inner) {
  //   inner >= 850 ? this.file = true : this.file = false;
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // this.mode ? this.file = !this.file : null;
  //   // console.log(changes)
  //   // this.stakedActive
  //   //   ? this.setPoolVisibleWithStake(this.stakedActive )
  //   //   : this.setPoolVisibleWithStake(this.stakedActive );
  // }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    if(this.intervalTime) clearInterval(this.intervalTime);
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

  async connectWallet():Promise<void>{
    await this.connectionService.openModal();
    await this.setPool();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.resizeWindow(window.innerWidth);
  }

  async ngOnInit(): Promise<any> {
    this.resizeWindow(window.innerWidth);
    await this.setPool();
  }

  resizeWindow(inner){
    console.log(inner);
    inner >= 1030 ? this.file = true : this.file = false;
  }

  async setPool(){
    this.isConnected = await this.connectionService.isWalletConnected();
    await this.calcPoolBlocks(this.pool.pool);
    await this.getTotalStakedToken();

    if (this.pool.type !== 'Stake') {
      await this.getLockUpDuration(this.pool.pool);
      await this.getFee(this.pool.pool);
    }
    this.setPoolType();

    if (this.isConnected) {
      this.userAccount = this.connectionService.getWalletAddress();
      await this.getUserDataInterval();
      // this.setPoolVisibleWithStake();
    }
  }

  /**
 * Pool filter by reward token harcoded
 */
  setPoolType() {
    // this.subscription1 = this.data.currentMessage.subscribe((message) => {
    //   this.showPool = false;
    //   this.filter = message;
    //   if (this.pool.type == this.filter || this.filter == 'all') {
    //     this.showPool = true;
    //   }
    // });
  }

  /**
 *
 * Show only active pools
 */
  // setPoolVisibleWithStake() {
  //   this.subscription2 = this.dexService.visible.subscribe((message) => {
  //     if (message == false ) {
  //       this.showPool = true;
  //       return;
  //     }
  //     if (message == true){
  //       if (parseInt(this.stakedOwn) == 0 || NaN ) {
  //         this.showPool = false;
  //         console.log('no show', this.showPool);
  //         return;
  //       }else {
  //         console.log('show',this.showPool);
  //         this.showPool = true;
  //         return;
  //       }
  //     }
  //   });
  // }

  /**
 * Retrieves lockup duration to claim withouth paying fee
 */
  async getLockUpDuration(address: string): Promise<any> {
    await this.dexService.getLockUpDuration(address).then((arg) => {
      this.lockupDuration = arg;
    });
  }

  async calcPoolBlocks(adress): Promise<any> {
    this.actualBlockNumber = await this.connectionService.blockNumber();
    this.hasStarted = parseInt(this.pool.startBlock) < parseInt(this.actualBlockNumber);
    this.hasEnded = parseInt(this.actualBlockNumber) > parseInt(this.pool.endBlock);
    this.blocksToEnd = parseInt(this.pool.endBlock) - parseInt(this.actualBlockNumber);
    this.blockToStart = parseInt(this.pool.startBlock) - parseInt(this.actualBlockNumber);
    // this.hasEnded
    // ? this.showPool = true
    // : null;
    // !this.hasStarted
    // ? this.timeToStart()
    // :null;
  }

  /**
   * Retrieves fee and the fee to withdraw;
   */
  async getFee(address): Promise<any> {
    const feeContract = await this.dexService.getFee(address);
    this.withdrawFee = (parseInt(feeContract) * (feeContract / 100)) / 100;
    this.fee = feeContract / 100;
  }

  /**
  * Retrieves total staked token info from the contract
  */
  async getTotalStakedToken(): Promise<any> {
    this.staked = await this.dexService.getPoolStakedTotal(this.pool.stakedToken.address, this.pool.pool);
  }

  async getUserDataInterval(): Promise<any> {
    await this.getUserStakedData().then();
    this.interval = setInterval(async ()=> await this.getUserStakedData(), 10000);
    this.intervalTime = setInterval(async() => await this.getTimeToWithdraw(), 1000);

  }



  async getPoolId(farm: string, address: string): Promise<any> {
    this.pool.id = await this.dexService.getPoolId(farm, address);
  }

  // async getInfo(farm:string, address:string){
  //   const functions = [
  //     {function:'positionPoolsByLP', args: [address]},
  //     {function:'resource', args: []},
  //     {function:'resourcePerBlock', args: []},
  //     {function:'poolInfo', args: [this.pool.id]},
  //     {function:'totalAllocPoint', args: []},
  //   ];
  //   const info = await this.dexService.getInfo(farm, functions, 'farm');
  //   console.log('pool info ',info);
  //   info[0].status === 'success' ? this.pool.id = info[0].result.toString(): this.pool.id = '';
  //   info[1].status === 'success' ? this.pool.rewardToken = info[1].result: this.pool.rewardToken = '';
  //   info[2].status === 'success' ? this.pool.resourcePerBlock = info[2].result.toString(): this.pool.resourcePerBlock = '';
  //   if(info[3].status === 'success'){
  //     this.pool.stakedToken = info[3].result[0];
  //     this.pool.allocPoint = info[3].result[1];
  //   }
  //   info[4].status === 'success' ? this.pool.totalAllocPoint = info[4].result.toString(): this.pool.totalAllocPoint = '';
  //   this.pool.stakedToken? await this.getInfoLp(this.pool.stakedToken):null;
  //   this.pool.rewardToken? await this.getInfoRewardToken(this.pool.rewardToken):null;
  // }

  // async getInfoLp(address:string): Promise<any>{
  //   const functions = [
  //     {function:'token0', args: []},
  //     {function:'token1', args: []},
  //   ];
  //   const info = await this.dexService.getInfo(address, functions, 'lp');
  //   info[0].status === 'success' ? this.pool.subsidiaryToken1 = info[0].result: this.pool.subsidiaryToken1 = '';
  //   info[1].status === 'success' ? this.pool.subsidiaryToken2 = info[1].result: this.pool.subsidiaryToken2 = '';

  //   const infoSubsidiary1 = await this.connectionService.fetchToken(this.pool.subsidiaryToken1);
  //   const infoSubsidiary2 = await this.connectionService.fetchToken(this.pool.subsidiaryToken2);
  //   if (infoSubsidiary1) {
  //     this.pool.subsidiaryTokenName1 = infoSubsidiary1.name;
  //     this.pool.subsidiaryTokenSymbol1 = infoSubsidiary1.symbol;
  //     this.pool.subsidiaryTokenDecimals1 = infoSubsidiary1.decimals;
  //   }
  //   if (infoSubsidiary2) {
  //     this.pool.subsidiaryTokenName2 = infoSubsidiary1.name;
  //     this.pool.subsidiaryTokenSymbol2 = infoSubsidiary1.symbol;
  //     this.pool.subsidiaryTokenDecimals2 = infoSubsidiary1.decimals;
  //   }
  // }

  // async getInfoRewardToken(address:any):Promise<any> {
  //   const tokenValue = await this.connectionService.fetchToken(address);
  //   if (tokenValue) {
  //     this.pool.rewardTokenName = tokenValue.name;
  //     this.pool.rewardTokenSymbol = tokenValue.symbol;
  //     this.pool.rewardTokenDecimals = tokenValue.decimals;

  //   }
  // }

  // async getStakedTotal(farm:string, address:string):Promise<any> {
  //   this.pool.stakedTotal = await this.dexService.getStakedTotal(farm, address);
  // }


  async getUserStakedData(): Promise<any> {
    const allowance = Number(await this.tokenService.getTokenAllowanceOnSpender(this.pool.stakedToken.address, this.pool.pool));
    if (allowance > 0 ) {
      await this.dexService.getUserPoolStakedData(this.pool.pool, this.userAccount, this.pool.type).then((res: any) => {
        this.stakedOwn = this.connectionService.fromWei(res.amount);
        res.firstDeposit
        ? this.firstDeposit = res.firstDeposit
        : this.firstDeposit = '0';

      //   this.dateToWithdraw = (parseInt(this.firstDeposit) + parseInt(this.lockupDuration));
      // if (this.dateToWithdraw < this.today ) {
      //   console.log(this.dateToWithdraw, this.today);

      //   this.canWithdraw = true;
      // }
      // const dateToday = this.today - parseInt(this.firstDeposit);
      // this.percentajeToWithdraw = (dateToday / parseInt(this.lockupDuration)) * 100;
      // // console.log(dateToday, parseInt(this.lockupDuration));
      // const countDown = (this.dateToWithdraw / 1000 - this.today) * 1000;
      // this.days = Math.floor(countDown / (1000 * 60 * 60 * 24));
      // this.hours = Math.floor(
      //   (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      // );
      // this.minutes = Math.floor(
      //   (countDown % (1000 * 60 * 60)) / (1000 * 60)
      // );
      // this.seconds = Math.floor((countDown % (1000 * 60)) / 1000);
      });

      await this.dexService.getPendingRewards(this.pool.pool, this.userAccount, this.pool.type, this.pool.rewardToken[0].address, this.pool.rewardToken[1]?.address).then((res:any) => {
        this.pendingRewards1 = this.connectionService.fromWei(res.dataWei0);

        res.dataWei1
        ? this.pendingRewards2 = this.connectionService.fromWei(res.dataWei1)
        : null;
      });
      this.isApproved = true;

    }

  }

  async getTimeToWithdraw(): Promise<void>{
    if(parseFloat(this.firstDeposit) > 0){
    this.dateToWithdraw = (parseInt(this.firstDeposit) + parseInt(this.lockupDuration)) * 1000;
    if (this.dateToWithdraw / 1000 < this.today ) {
      this.canWithdraw = true;
    }

    const dateToday = this.today - parseInt(this.firstDeposit);
    this.percentajeToWithdraw = (dateToday / parseInt(this.lockupDuration)) * 100;

      const todayDate = new Date().getTime() / 1000;
      const countDown = (this.dateToWithdraw / 1000 - todayDate) * 1000;
      this.days = Math.floor(countDown / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor(
        (countDown % (1000 * 60 * 60)) / (1000 * 60)
      );
      this.seconds = Math.floor((countDown % (1000 * 60)) / 1000);
      console.log('first',this.days);



    // const dateToday = this.today - parseInt(this.firstDeposit);
    // this.percentajeToWithdraw = (dateToday / parseInt(this.lockupDuration)) * 100;
    // // console.log(dateToday, parseInt(this.lockupDuration));
    // const countDown = (this.dateToWithdraw / 1000 - this.today) * 1000;
    // this.days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    // this.hours = Math.floor(
    //   (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    // );
    // this.minutes = Math.floor(
    //   (countDown % (1000 * 60 * 60)) / (1000 * 60)
    // );
    // this.seconds = Math.floor((countDown % (1000 * 60)) / 1000);

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
      this.dialog.open(PopUpCustomAllowanceComponent, {
        panelClass: 'lootbox-dialog-container'
      }).afterClosed().subscribe(res => {
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
      await this.tokenService.tokenApprove(this.pool.pool, this.pool.stakedToken.address, amount).then(() => {
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
      this.tokenService.getTokenAllowanceOnSpender(this.pool.stakedToken.address, this.pool.pool).then(res => {
        let allowed = this.connectionService.fromWei(res);
        if (parseFloat(allowed) > 0) {
          this.isApproved = true;
        }
        if (parseFloat(allowed) == 0) {
          this.isApproved = false;
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
    await this.dexService.claimPool(this.pool.pool);
    await this.getUserDataInterval();
  }

  /**
   * Withdraw from the pool
   */
  async withdraw(): Promise<void> {
    console.log('withdraw');
    if (this.pool.stakedToken.LPToken) {
      let data = {
        type: 'withdraw',
        pool: this.pool.pool,
        staked: this.stakedOwn,
        // token0: this.pool.stakedToken.LPToken?.token0,
        // token1: this.pool.stakedToken.LPToken?.token1,
        token0Symbol: this.pool.stakedToken.LPToken?.token0Symbol,
        token1Symbol: this.pool.stakedToken.LPToken?.token1Symbol,
        address: this.pool.stakedToken.address,
        symbol: this.pool.stakedToken.symbol,
        fee: this.fee
      };
      console.log(data);
      await this.dexDialogService.openWithdrawDialog(
        data
      ).afterClosed().subscribe(async (res: any) => {
        this.goWithdraw(res);
      });
    }
    if (!this.pool.stakedToken.LPToken) {
      let data = {
        type: 'withdraw',
        pool: this.pool.pool,
        staked: this.stakedOwn,
        token0Symbol: this.pool.stakedToken.LPToken?.token0Symbol,
        token1Symbol: this.pool.stakedToken.LPToken?.token1Symbol,
        address: this.pool.stakedToken.address,
        symbol: this.pool.stakedToken.symbol,
        // decimals: this.pool.stakedToken.decimals,
      };
      await this.dexDialogService.openWithdrawDialog(
        data
      ).afterClosed().subscribe(async (res: any) => {
        this.goWithdraw(res);
      });
    }
    // await this.dexDialogService.openWithdrawDialog(
    //   data
    // ).afterClosed().subscribe(async (res: any) => {
    //   try {
    //     console.log(res);
    //     const amount = res.toString();
    //     await this.dexService.withdrawPool(this.pool.pool, amount);
    //   } catch (error: any) { }
    // });
  }

  async goWithdraw(res:any): Promise<void>{
    try {
      const amount = res.toString();
      await this.dexService.withdrawPool(this.pool.pool, amount);
    } catch (error: any) { }
  }

  /**
 * Deposit lp to the pool
 */
  async deposit(): Promise<void> {

    await this.dexDialogService.openStakeDialog(
      'deposit',
      this.pool.pool,
      this.staked,
      this.pool.stakedToken.LPToken?.token0Symbol,
      this.pool.stakedToken.LPToken?.token1Symbol,
      this.pool.stakedToken.address,
      this.pool.stakedToken.symbol).afterClosed().subscribe(async (res: any) => {
        try {
          const amount = res.toString();
          await this.dexService.depositPool(this.pool.pool, this.pool.stakedToken.address, amount);
        } catch (error: any) { }
      });
  }

  showDetails() {
    this.showDetDiv = !this.showDetDiv;
  }

  apy() {
    const dialogRef = this.dialog.open(ApyComponent, {
      panelClass: 'lootbox-dialog-container',
      data : {
        pool: this.pool,
        staked: this.stakedOwn,
        stakedTotal: this.staked
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  /**
 * Set token on metamask
 */
  async setTokenOnMetamask(token:number): Promise<void> {
    token == 1
    ? await this.connectionService.setTokenOnMetamask('ERC20', this.pool.rewardToken[0].address, this.pool.rewardToken[0].symbol, '18', this.pool.rewardToken[0].symbol + '.png')
    :await this.connectionService.setTokenOnMetamask('ERC20', this.pool.rewardToken[1].address, this.pool.rewardToken[1].symbol, '18', this.pool.rewardToken[1].symbol + '.png')
  }

}
