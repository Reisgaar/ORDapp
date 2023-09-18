import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { DexService } from 'src/app/shared/services/dex/dex.service';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';

@Component({
  selector: 'app-defi-header',
  templateUrl: './defi-header.component.html',
  styleUrls: ['./defi-header.component.scss'],
})
export class DefiHeaderComponent implements OnChanges {

  @Input() type: string = '';

  title: string = '';
  subtitle: string = '';
  tip: string = '';
  tipEarn: string = '';
  list: { type: string; link: string }[] = [];
  id: any;

  constructor(
    private route: ActivatedRoute,
    private dexService: DexService,
    private governanceDialogService: GovernanceDialogService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('snap in head', this.type);
    if (this.type == 'farms') {
      this.title = 'defi.header.farms';
      this.subtitle = 'defi.header.farmsExplain';
      this.tip = 'defi.header.learn';
      this.tipEarn = 'defi.header.earn';
      this.list = [
        { type: 'All', link: 'buyGq' },
        { type: 'Iron', link: 'iron' },
        { type: 'Copper', link: 'copper' },
      ];
    }
    if (this.type == 'pools') {
      this.title = 'defi.header.pools';
      this.subtitle = 'defi.header.poolsExplain';
      this.tip = 'defi.header.learn';
      this.tipEarn = 'defi.header.earn';
      this.list = [
        { type: 'All', link: 'all' },
        { type: 'GQ', link: 'GQ-GQ' },
        { type: 'LPs', link: 'LP' },
        { type: 'Alliance', link: 'galactic' },
        { type: 'Actives', link: 'ended' },
      ];
    }
  }


  selectPoolType(type:string){
    this.dexService.changePoolType(type);
  }

    /**
   * Opens the pop up to buy GQ
   */
    buyGqPopUp(): void {
      this.governanceDialogService.openBuyGqDialog();
    }

}
