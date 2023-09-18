import { Component, OnInit } from '@angular/core';
import { tokensAvailaleForBridge } from 'src/app/constants/bridge';

@Component({
  selector: 'app-bridge-to-game',
  templateUrl: './bridge-to-game.component.html',
  styleUrls: ['./bridge-to-game.component.scss']
})
export class BridgeToGameComponent implements OnInit {
  gqBalance: string = '';
  interval: any;
  loadingBalance: boolean = true;
  tokensForBridge = tokensAvailaleForBridge;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

}
