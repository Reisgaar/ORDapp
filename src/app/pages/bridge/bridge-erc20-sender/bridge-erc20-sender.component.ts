import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { BridgeService } from 'src/app/shared/services/bridge/bridge.service';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bridge-erc20-sender',
  templateUrl: './bridge-erc20-sender.component.html',
  styleUrls: ['./bridge-erc20-sender.component.scss']
})
export class BridgeERC20SenderComponent implements OnInit, OnDestroy {
  @Input() token: any;
  interval: any;
  loadingBalance: boolean = true;
  amountIsConfirmed: boolean = false;
  sendToAnotherWallet: boolean = false;
  tokenBalance: string = '';
  tokenSelectedAmount: string = '0';
  formError: boolean = false;
  walletError: boolean = false;
  receiver: string = '';

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private bridgeService: BridgeService
  ) { }

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getBalance();
    this.interval = setInterval(() => {
      this.getBalance();
    }, 5000);
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets balance of the token
   */
  async getBalance(): Promise<any> {
    // Just fix for testnet
    if (environment.network === 'testnet') {
      console.log('TESTNET!!!')
      this.token.constant = 'gqBridge';
    }
    //
    this.tokenBalance = await this.tokenService.getBalanceOfToken(contractAddresses[this.token.constant]);
    this.loadingBalance = false;
  }

  /**
   * Sets the amount with the given percent
   * @param percent percent to set amount
   */
  setAmountToPercent(percent: number): void {
    if (percent === 100) {
      this.tokenSelectedAmount = this.connectionService.fromWei(this.tokenBalance);
    } else {
      this.tokenSelectedAmount = Math.round(parseInt(this.connectionService.fromWei(this.tokenBalance).toString(), 0) * (percent / 100)).toString();
    }
    this.validateForm();
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    if (event.key.toLowerCase() === 'enter') {
      this.checkAmountAndContinue();
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
      const totalGqBN = await this.connectionService.ethers.utils.parseUnits(this.tokenBalance, "wei");
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

  /**
   * Start the process to send tokens to the game
   */
  checkAmountAndContinue(): void {
    this.amountIsConfirmed = true;
    this.receiver = this.connectionService.getWalletAddress();
  }

  backToForm(): void {
    this.amountIsConfirmed = false;
    this.receiver = '';
    this.sendToAnotherWallet = false;
  }

  switchReceiverWalletCheckbox(): void {
    this.sendToAnotherWallet = !this.sendToAnotherWallet;
    if (this.sendToAnotherWallet) {
      this.receiver = '';
      this.walletError = true;
    } else {
      this.receiver = this.connectionService.getWalletAddress();
      this.walletError = false;
    }
  }

  /**
   * Validates if added wallet is valid
   */
  validateWalletInput(): void {
    this.walletError = !this.connectionService.ethers.utils.isAddress(this.receiver);
  }

  /**
   * Start the process to send tokens to the game
   */
  async sendTokenToGame(): Promise<any> {
    await this.bridgeService.sendTokenToGame(this.receiver, contractAddresses[this.token.constant], this.token.ticker, this.tokenSelectedAmount).then( res => {
      console.log(res);
      if (res) {
        this.amountIsConfirmed = false;
        this.receiver = '';
        this.sendToAnotherWallet = false;
        this.tokenSelectedAmount = '0';
      }
    });
  }

}
