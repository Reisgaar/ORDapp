import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { BridgeService } from 'src/app/shared/services/bridge/bridge.service';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-bridge-erc20-receiver',
  templateUrl: './bridge-erc20-receiver.component.html',
  styleUrls: ['./bridge-erc20-receiver.component.scss']
})
export class BridgeErc20ReceiverComponent implements OnInit, OnDestroy {
  @Input() token: any;
  interval: any;
  tokensToRedeem: any;
  loadingTokens: boolean = true;
  tokenSelectedAmount: string = '0';
  formError: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private bridgeService: BridgeService
  ) { }

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getTokensToRedeem();
    this.interval = setInterval(() => {
      this.getTokensToRedeem();
    }, 5000);
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  async getTokensToRedeem(): Promise<any> {
    this.tokensToRedeem = await this.bridgeService.getTokensToRedeem();
  }

  async claimTokens(): Promise<any> {
    const amount = this.connectionService.toWei(this.tokenSelectedAmount);
    await this.bridgeService.claimTokens(amount);
  }

  /**
   * Sets the amount with the given percent
   * @param percent percent to set amount
   */
  setAmountToPercent(percent: number): void {
    if (percent === 100) {
      this.tokenSelectedAmount = this.connectionService.fromWei(this.tokensToRedeem);
    } else {
      this.tokenSelectedAmount = Math.round(parseInt(this.connectionService.fromWei(this.tokensToRedeem).toString(), 0) * (percent / 100)).toString();
    }
    this.validateForm();
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    if (event.key.toLowerCase() === 'enter') {
      this.claimTokens();
    } else {
      // If not number prevent default
      if (isNaN(parseInt(event.key, 0))) {
        event.preventDefault();
      }
      // If , or . write . only once
      if ((event.key === ',' || event.key === '.') && !event.target.value.includes('.')) {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const oldValue = event.target.value;
        event.target.value = oldValue.slice(0, start) + '.' + oldValue.slice(end);
      }
      // Limit to 18 decimals
      if (event.target.value.indexOf('.') >= 0 && event.target.selectionStart > event.target.value.indexOf('.')) {
        event.target.value = event.target.value.slice(0, event.target.value.indexOf('.') + 18);
      }
      // If first enter, remove 0
      if (event.target.value === '0' && !isNaN(parseInt(event.key, 0))) {
        event.target.value = '';
      }
    }
  }

  /**
   * Validates the form
   * @returns true if is valid
   */
  async validateForm(): Promise<any> {
    this.formError = false;
    if (this.tokenSelectedAmount !== '' && this.tokenSelectedAmount !== '0') {
      // Transform to wei to avoid decimals and to BN to make comparison
      const selectedGqBN = await this.connectionService.ethers.utils.parseUnits(this.tokenSelectedAmount, "ether");
      const totalGqBN = await this.connectionService.ethers.utils.parseUnits(this.tokensToRedeem, "wei");
      const hasBalance = selectedGqBN.lte(totalGqBN);
      if (hasBalance) {
        return true;
      } else {
        this.formError = true;
        return false;
      }
    } else {
      this.formError = false;
      return false;
    }
  }

}
