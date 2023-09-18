import { Component, OnInit } from '@angular/core';
import { tokensAvailaleForBridge } from 'src/app/constants/bridge';

@Component({
  selector: 'app-bridge-from-game',
  templateUrl: './bridge-from-game.component.html',
  styleUrls: ['./bridge-from-game.component.scss']
})
export class BridgeFromGameComponent implements OnInit {
  tokensAvailable: any = tokensAvailaleForBridge;

  constructor() { }

  ngOnInit(): void {
  }
}
