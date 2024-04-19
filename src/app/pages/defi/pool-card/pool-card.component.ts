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
import { contractAddresses } from 'src/app/constants/contractAddresses';

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
  earnGQ1: string = 'earnGQ1';
  earnGQ2: string = 'earnGQ2';
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


  constructor(
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private dexService: DexService,
    private tokenService: TokenService,
    private dexDialogService: DexDialogService
  ) { }


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

    if (this.isConnected) {
      this.userAccount = this.connectionService.getWalletAddress();
      await this.getUserDataInterval();
    }
  }




  /**
 * Retrieves lockup duration to claim withouth paying fee
 */
  async getLockUpDuration(address: string): Promise<any> {
    await this.dexService.getLockUpDuration(address).then((arg) => {
      console.log('lockupDuration', arg);
      this.lockupDuration = arg;
    });
  }

  async calcPoolBlocks(adress): Promise<any> {
    this.actualBlockNumber = await this.connectionService.blockNumber();
    this.hasStarted = parseInt(this.pool.startBlock) < parseInt(this.actualBlockNumber);
    this.hasEnded = parseInt(this.actualBlockNumber) > parseInt(this.pool.endBlock);
    this.blocksToEnd = parseInt(this.pool.endBlock) - parseInt(this.actualBlockNumber);
    this.blockToStart = parseInt(this.pool.startBlock) - parseInt(this.actualBlockNumber);

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

   async getUserStakedData(): Promise<any> {
    const allowance = Number(await this.tokenService.getTokenAllowanceOnSpender(this.pool.stakedToken.address, this.pool.pool));
    // if (allowance > 0 ) {
      await this.dexService.getUserPoolStakedData(this.pool.pool, this.userAccount, this.pool.type).then((res: any) => {
        this.stakedOwn = this.connectionService.fromWei(res.amount);
        res.firstDeposit
        ? this.firstDeposit = res.firstDeposit
        : this.firstDeposit = '0';
      });

      await this.dexService.getPendingRewards(this.pool.pool, this.userAccount, this.pool.type, this.pool.rewardToken[0].address, this.pool.rewardToken[1]?.address).then((res:any) => {
        this.pendingRewards1 = this.connectionService.fromWei(res.dataWei0);

        res.dataWei1
        ? this.pendingRewards2 = this.connectionService.fromWei(res.dataWei1)
        : null;
      });
      if (allowance > 0 ) {

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
    if (await this.connectionService.isWalletConnected()) {
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
    }
  }



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
      const data = {
        type: 'withdraw',
        pool: this.pool.pool,
        staked: this.stakedOwn,
        token0Symbol: this.pool.stakedToken.LPToken?.token0Symbol,
        token1Symbol: this.pool.stakedToken.LPToken?.token1Symbol,
        address: this.pool.stakedToken.address,
        symbol: this.pool.stakedToken.symbol,
        fee: this.fee,
        canWithdraw : this.canWithdraw
      };
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
        canWithdraw : this.canWithdraw
        // decimals: this.pool.stakedToken.decimals,
      };
      await this.dexDialogService.openWithdrawDialog(
        data
      ).afterClosed().subscribe(async (res: any) => {
        this.goWithdraw(res);
      });
    }
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

  tokenHasPrice(token:string): boolean{
    if(token.toLowerCase() == contractAddresses.carbon.toLowerCase() ||
    token.toLowerCase() == contractAddresses.nickel.toLowerCase() ||
    token.toLowerCase() == contractAddresses.vanadium.toLowerCase() ||
    token.toLowerCase() == contractAddresses.methane.toLowerCase() ||
    token.toLowerCase() == contractAddresses.plutonium.toLowerCase() ||
    token.toLowerCase() == contractAddresses.acetylene.toLowerCase() ||
    token.toLowerCase() == contractAddresses.argon.toLowerCase() ||
    token.toLowerCase() == contractAddresses.iron.toLowerCase() ||
    token.toLowerCase() == contractAddresses.copper.toLowerCase() ||
    token.toLowerCase() == contractAddresses.oxygen.toLowerCase() ||
    token.toLowerCase() == contractAddresses.hydrogen.toLowerCase() ||
    token.toLowerCase() == contractAddresses.silicon.toLowerCase() ||
    token.toLowerCase() == contractAddresses.chromium.toLowerCase()||
    token.toLowerCase() == contractAddresses.helium.toLowerCase() ||
    token.toLowerCase() == contractAddresses.aluminium.toLowerCase() ||
    token.toLowerCase() == contractAddresses.cobalt.toLowerCase()
    ){
      return false;
    } else {
      return true;
    }
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
