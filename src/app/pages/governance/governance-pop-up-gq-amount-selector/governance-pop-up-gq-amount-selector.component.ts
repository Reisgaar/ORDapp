import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { StakeService } from 'src/app/shared/services/governance/stake.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

/**
 * Pop Up with a selector to stake GQ on governance Pools
 */
@Component({
  selector: 'app-governance-pop-up-gq-amount-selector',
  templateUrl: './governance-pop-up-gq-amount-selector.component.html',
  styleUrls: ['./governance-pop-up-gq-amount-selector.component.scss']
})
export class GovernancePopUpGqAmountSelectorComponent implements OnInit, OnDestroy {
  amount: string = '0';
  maxAmount: string;
  maxAmountHalf = '';
  maxAmountQuarter = '';
  interval: any;
  inputTooHigh: boolean = false;
  inputNegative: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GovernancePopUpGqAmountSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenService: TokenService,
    private stakeService: StakeService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    if (this.data.type === 'deposit') {
      this.getGQBalance();
      this.interval = setInterval(async () => {
        this.getGQBalance();
      }, 3000);
    } else {
      this.getStakedGQ();
    }
  }

  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Sets the range of the input
   * @param {number} newAmount : ProductType Name
   */
  setRange(newAmount: number): void {
    if (newAmount !== 100) {
      this.amount = (parseFloat(this.maxAmount) * (newAmount / 100)).toString();
    } else {
      this.amount = this.maxAmount;
    }
  }

  /**
   * Confirms the action of the user
   */
  async confirmAction(): Promise<void> {
    this.inputNegative = false;
    this.inputTooHigh = false;
    if (parseFloat(this.amount) <= 0) {
      this.inputNegative = true;
    } else if (parseFloat(this.amount) > parseFloat(this.maxAmount)) {
      this.inputTooHigh = true;
    } else {
      this.dialogRef.close(this.amount);
    }
  }

  /**
   * Gets user's GQ Balance
   */
  async getGQBalance(): Promise<void> {
    let gq = await this.tokenService.getBalanceOfToken(contractAddresses.gq);
    gq = this.connectionService.fromWei(gq);
    this.maxAmount = gq;
    this.getHalfandQuarter();
  }

  /**
   * Gets user's Staked GQ
   */
  async getStakedGQ(): Promise<void> {
    const userInfo = await this.stakeService.getUserInfo(this.data.pool);
    this.maxAmount = this.connectionService.fromWei(userInfo.amount);
  }

  /**
   * Gets maxAmounts half and quarter to step input
   */
  getHalfandQuarter(): void {
    this.maxAmountHalf = (parseFloat(this.maxAmount) / 2).toString();
    this.maxAmountQuarter =  (parseFloat(this.maxAmount) / 4).toString();
  }

  /**
   * Prevents the erase on the input
   * @param {any} event : the keypress event
   */
  preventErase(event: any): void {
    if (event.keyCode === 46) {
      event.preventDefault();
    }
  }

  /**
   * Closes this popUp
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
