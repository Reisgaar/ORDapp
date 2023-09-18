import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

/**
 * Pop Up to confirm amount and vote on a proposal
 */
@Component({
  selector: 'app-governance-pop-up-vote',
  templateUrl: './governance-pop-up-vote.component.html',
  styleUrls: ['./governance-pop-up-vote.component.scss']
})
export class GovernancePopUpVoteComponent implements OnInit, OnDestroy {
  amount = 0;
  maxAmount: number;
  interval: any;
  inputTooHigh: boolean = false;
  inputNegative: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GovernancePopUpVoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenService: TokenService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    this.getVotingTokenBalance();
    this.interval = setInterval(async () => {
      this.getVotingTokenBalance();
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Sets the range of the input
   * @param {number} newAmount : ProductType Name
   */
  setRange(newAmount: number): void {
    this.amount = this.maxAmount * (newAmount / 100);
    const range = document.getElementById('amount-range') as HTMLInputElement;
    range.value = this.amount.toString();
  }

  /**
   * Confirms the voting action
   */
  async confirmVote(): Promise<void> {
    this.inputNegative = false;
    this.inputTooHigh = false;
    if (this.amount <= 0) {
      this.inputNegative = true;
    } else if (this.amount > this.maxAmount) {
      this.inputTooHigh = true;
    } else {
      this.dialogRef.close(this.amount);
    }
  }

  /**
   * Gets user's VP Balance
   */
  async getVotingTokenBalance(): Promise<void> {
    let orvp = await this.tokenService.getBalanceOfToken(contractAddresses.vp);
    orvp = this.connectionService.fromWei(orvp);
    this.maxAmount = parseFloat(orvp);
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
