import { Component } from '@angular/core';

@Component({
  selector: 'app-liquidity-add',
  templateUrl: './liquidity-add.component.html',
  styleUrls: ['./liquidity-add.component.scss']
})
export class LiquidityAddComponent {
  liquidity = {
    token1: 'Token1',
    token1blance: '0000000.00000',
    token1Icon: 'gq_mini.jpg',
    token2: 'token2',
    token2blance: '0000000.00000',
    token2Icon: 'gq_mini.jpg',
    slippage: '1'
  }
  connected= true;
}
