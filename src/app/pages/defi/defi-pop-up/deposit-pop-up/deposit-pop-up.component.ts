import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-deposit-pop-up',
  templateUrl: './deposit-pop-up.component.html',
  styleUrls: ['./deposit-pop-up.component.scss']
})
export class DepositPopUpComponent implements OnInit {
  addToken: string;
  maxAmount: string;
  maxAmountHalf = '';
  maxAmountQuarter = '';
  interval: any;

  amount: string = '0';
  inputTooHigh: boolean = false;
  inputNegative: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DepositPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private connectionService: ConnectionService,
    private tokenService: TokenService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    if (this.data.type === 'deposit') {
      await this.setTokensAvailable();
      this.interval = setInterval(async () => {
        this.setTokensAvailable();
      }, 3000);
    } else {
      this.maxAmount = this.data.staked;
    }
  }

  /**
 *
 * @returns max token available in wallet
 */
  async setTokensAvailable(): Promise<void> {
    const avalilable = await this.tokenService.getBalanceOfToken(this.data.stakedToken);
    const token = this.connectionService.fromWei(avalilable);
    this.maxAmount = token;
    // .toFixed(this.data.stakedTokenDecimals);
  }

  /**
 * Approve add to pools
 */
  approveSupply(): void {
    this.dialogRef.close(this.addToken);
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
 * Gets maxAmounts half and quarter to step input
 */
  getHalfandQuarter(): void {
    this.maxAmountHalf = (parseFloat(this.maxAmount) / 2).toString();
    this.maxAmountQuarter = (parseFloat(this.maxAmount) / 4).toString();
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
