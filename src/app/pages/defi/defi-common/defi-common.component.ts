import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';

@Component({
  selector: 'app-defi-common',
  templateUrl: './defi-common.component.html',
  styleUrls: ['./defi-common.component.scss'],
})
export class DefiCommonComponent implements OnInit, OnChanges {
  isConnected: boolean;
  sorted: string;
  stakedActive: boolean = false;
  id: string = '';
  typeOfPool: string = 'all';
  mode: string = 'row';
  ended: boolean = true;
  actualBlock: string = '';
  endBlock: string = '';
  file: boolean = true;

  type: Subscription = this.dexService.currentPool.subscribe((res: string) => {
    console.log('defi filter', res);
    if (res !== '') this.setMode(res);
  });
  constructor(
    private route: ActivatedRoute,
    private dexService: DexService,
    private connectionService: ConnectionService) {}

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
      this.resizeWindow(window.innerWidth);
    }

  async ngOnInit() {
    this.isConnected = await this.connectionService.isWalletConnected();
    const data: Data = this.route.snapshot.data;
    console.log('Snapshot ',data);
    const block = await this.connectionService.blockNumber();
    this.actualBlock = block.toString();
    console.log(this.actualBlock);
    this.id = data.msg;
    this.resizeWindow(window.innerWidth);

  }

  ngOnDestroy(): void {
    this.type.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);

  }

  resizeWindow(inner){
    console.log(inner);
    inner >= 1030 ? this.file = true : this.file = false;
  }

  enableOnlyStaked() {
    this.stakedActive = !this.stakedActive;
    console.log('active',this.stakedActive);
    this.dexService.setVisible(this.stakedActive);
  }

  enableOnlyNotEnded(): void{
    console.log('not ended');
    this.ended = !this.ended;
    this.dexService.setActivePools(this.ended);
  }
  sortData(sorted:string): void{
    this.sorted = sorted;
  }

  setMode(mode: string) {
    this.sorted = mode;
  }

  setFile(file){
    this.dexService.setFile(file);
  }

  // applyFilter(event: Event){
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dexService.setPoolFilter(filterValue);
  // }
}
