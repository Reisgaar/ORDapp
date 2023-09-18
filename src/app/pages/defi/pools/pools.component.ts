import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { getPools } from 'src/app/constants/gqlQueries';
import { PoolsTotal } from 'src/app/interfaces/pools-total';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { Subscription } from 'rxjs';
import { bnbPriceOnBusd, gqPriceOnBusd, ipxPriceOnBusd, sckPriceOnBusd, cpoPriceOnBusd} from 'src/app/constants/pricesOnBusd';
import { OracleApiService } from 'src/app/shared/services/oracle-api.service';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./pools.component.scss'],
})
export class PoolsComponent implements OnInit, OnChanges, OnDestroy {
  pools: any;
  poolsSubscription: any;
  poolsTotal: PoolsTotal[] = [];
  poolsFiltered: any[] = [];
  type: string = '';
  interval: any;
  displayedColumns: string[] = ['pool'];
  dataSource = new MatTableDataSource<PoolsTotal>();
  file: boolean = true;

  subscription: Subscription = this.dexService.currentFile.subscribe((message: string) => {
    message == 'row'
      ? this.file = true
      : this.file = false
  });
  subscriptionEnd: Subscription = this.dexService.currentEnded.subscribe((message:boolean) => {
    this.poolsFiltered = [];
    message
      ? this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsTotal)
      : this.setOnlyActive();
  });

  @Input() typeOfPool: string = 'All';
  // @Input() mode: string;
  @Input() endBlock: string;
  @Input() sorted: string;
  @Input() stakedActive: boolean = true;


  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.resizeWindow(window.innerWidth);
  }

  constructor(
    private apollo: Apollo,
    private dexService: DexService,
    private connectionService: ConnectionService,
    private oracleApiService: OracleApiService
    ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.poolsSubscription.unsubscribe();
    this.subscriptionEnd.unsubscribe();
    clearInterval(this.interval);

    // this.subscriptionFilter.unsubscribe();
  }

  async ngOnChanges(changes: SimpleChanges) {
    console.log(changes, this.typeOfPool, this.endBlock, this.sorted);
    this.typeOfPool == 'all'
      ? (this.dataSource.filter = '')
      : (this.dataSource.filter = this.typeOfPool);
      this.poolsFiltered = [];
      if(this.sorted == 'GQ-GQ'){this.setQueryPoolsGQ()}
      if(this.sorted == 'galactic'){this.setQueryPoolsGalactic()}
      if(this.sorted == 'LP'){this.setQueryPoolsLP()}
      if(this.sorted == 'all'){
        this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsTotal);
      }
      if(this.sorted == 'ended'){await this.setOnlyActive()}
      if(this.sorted == 'materials'){await this.setOnlyMaterialsPool()}


    }


  async ngOnInit(): Promise<any> {
    this.getPricesOnBusd();
    this.interval = setInterval(() => {
      this.getPricesOnBusd();
    }, 300000);

    this.resizeWindow(window.innerWidth);
    await this.setPools();

  }

  resizeWindow(inner){
    console.log(inner);
    inner >= 1030 ? this.file = true : this.file = false;
  }

  async setPools() {

    this.pools = this.apollo.use('pools').watchQuery({
      query: getPools,
      pollInterval: 3000,
      variables: {
        endBlock: this.endBlock,
      },
    });
    this.poolsSubscription = this.pools.valueChanges.subscribe(
      async (res: any) => {
        console.log(res);
        this.poolsTotal = res.data.pools;
        this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsTotal);
      }
    );
  }

    /**
   * Gets the prices of BNB and GQ on BUSD
   */
    getPricesOnBusd(): any {
      this.oracleApiService.getTokenPricesOnUsdDex()?.subscribe( (res: any) => {
        bnbPriceOnBusd[0] = res.binancecoin.usd;
        gqPriceOnBusd[0] = res['outer-ring'].usd;
        ipxPriceOnBusd[0] = res['inpulse-x-2'].usd;
        sckPriceOnBusd[0] = res['space-corsair-key'].usd;
        cpoPriceOnBusd[0] = res['cryptopolis'].usd;
      });
      this.oracleApiService.getTokenPricesOnUsd();
    }

  setQueryPoolsGQ(){
    this.poolsTotal.forEach((res:any) => {
      if (
        res.stakedToken.address.toLowerCase() && res.rewardToken[0].address.toLowerCase() == contractAddresses.gq.toLowerCase()) this.poolsFiltered.push(res);
    });
    console.log(this.poolsFiltered);
    this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsFiltered);
  }

  setQueryPoolsGalactic(){
    this.poolsTotal.forEach((res:any) => {
      if (res.type == 'GalacticAlliance') this.poolsFiltered.push(res);
    });
    console.log(this.poolsFiltered);
    this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsFiltered);
  }

  setQueryPoolsLP(){
    this.poolsTotal.forEach((res:any) => {
      if (res.stakedToken.LPToken != null) this.poolsFiltered.push(res);
    });
    console.log(this.poolsFiltered);
    this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsFiltered);
  }

  setOnlyMaterialsPool(){
    this.poolsTotal.forEach((res:any) => {
      if (res.type == 'GalacticReserve') this.poolsFiltered.push(res);
    });
    console.log(this.poolsFiltered);
    this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsFiltered);
  }


  async setOnlyActive(){
    const block = parseInt(await this.connectionService.blockNumber());
    console.log(block);
    this.poolsTotal.forEach((res:any) => {
      if (res.endBlock > block) this.poolsFiltered.push(res);
    });
    console.log(this.poolsFiltered);
    this.dataSource = new MatTableDataSource<PoolsTotal>(this.poolsFiltered);

  }

  // poolFilterByText(data){
  //   const red = this.poolsTotal.forEach((pool: any)=> {
  //     // pool.map(val => [val, val.stakedToken, ...val.rewardToken]).reduce((acc, cur) => [...acc, ...cur]);
  //     const result = Object.keys(pool).reduce(function (r, k) {
  //       return r.concat(pool[k]);
  //   }, []);
  //   this.poolsFiltered.push(result);
  //   });
  //   console.log(this.poolsFiltered, this.poolsFiltered.filter((x:any)=>{data.includes(x)}));
  // }

}
