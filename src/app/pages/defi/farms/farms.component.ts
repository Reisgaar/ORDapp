import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BigNumber } from 'ethers';
import { Subscription, interval } from 'rxjs';
import { Pool } from 'src/app/interfaces/pool';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';


@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit, OnChanges{

  pools: Pool[] = [];
  displayedColumns: string[] = ['pool'];
  dataSource = new MatTableDataSource<Pool>();;
  farmsFiltered: Pool[] = [];
  file: boolean = true;
  @Input() sorted: string;

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.resizeWindow(window.innerWidth);
  }

  subscription1: Subscription = this.dexService.currentFile.subscribe((message: string) => {
    message == 'row'
      ? this.resizeWindow(window.innerWidth)
      : this.file = false
  });

  constructor(
    private dexService: DexService,
    ){
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, this.sorted);
    this.farmsFiltered = [];

    if(this.sorted == 'copper'){this.setQueryPoolsCopper()}
    if(this.sorted == 'iron'){this.setQueryPoolsIron()}

    }

  async ngOnInit(): Promise<void> {
    this.resizeWindow(window.innerWidth);
    //Get the existent pools from service
    this.pools = await this.dexService.getPools();
    console.log('Pools ',this.pools);
    this.dataSource = new MatTableDataSource<Pool>(this.pools);
    interval(10000).subscribe(async () => {
      this.pools = await this.dexService.getPools();
      this.dataSource = new MatTableDataSource<Pool>(this.pools);
    });
  }

  resizeWindow(inner){
    console.log(inner);
    inner >= 1030 ? this.file = true : this.file = false;
  }

  setQueryPoolsCopper(){
    this.pools.forEach((res:any) => {
      if (
        res.rewardToken.toLowerCase() == contractAddresses.copper.toLowerCase()) this.farmsFiltered.push(res);
    });
    console.log(this.farmsFiltered);
    this.dataSource = new MatTableDataSource<Pool>(this.farmsFiltered);
  }

  setQueryPoolsIron(){
    this.pools.forEach((res:any) => {
      if (
        res.rewardToken.toLowerCase() == contractAddresses.iron.toLowerCase()) this.farmsFiltered.push(res);
    });
    console.log(this.farmsFiltered);
    this.dataSource = new MatTableDataSource<Pool>(this.farmsFiltered);
  }


}
