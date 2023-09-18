import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Proposal } from 'src/app/interfaces/proposal';
import { GovernancePopUpBuyGqComponent } from 'src/app/pages/governance/governance-pop-up-buy-gq/governance-pop-up-buy-gq.component';
import { GovernancePopUpGqAmountSelectorComponent } from 'src/app/pages/governance/governance-pop-up-gq-amount-selector/governance-pop-up-gq-amount-selector.component';
import { GovernancePopUpVoteComponent } from 'src/app/pages/governance/governance-pop-up-vote/governance-pop-up-vote.component';

/**
 * Service to manage governance dialogs
 */
@Injectable({
  providedIn: 'root'
})
export class GovernanceDialogService {

  constructor(
    public dialog: MatDialog
  ) { }

  /**
   * Opens the voting dialog
   * @param vote : number of the option to vote
   * @param proposal : proposal to vote on
   * @returns : the dialog
   */
  openVotingDialog(vote: number, proposal: Proposal): any {
    return this.dialog.open(GovernancePopUpVoteComponent, {
      panelClass: 'voting-dialog-container',
      data: { vote, proposal }
    });
  }

  /**
   * Opens the staking dialog
   * @param type : type of operation (deposit or withdraw)
   * @param pool : number of the pool
   * @returns : the dialog
   */
  openStakingDialog(type: string, pool: number): any {
    return this.dialog.open(GovernancePopUpGqAmountSelectorComponent, {
      panelClass: 'voting-dialog-container',
      data: { type, pool }
    });
  }

  /**
   * Opens a dialog with options to buy GQ
   * @returns : the dialog
   */
  openBuyGqDialog(): any {
    return this.dialog.open(GovernancePopUpBuyGqComponent, {
      panelClass: 'buygq-dialog-container',
      autoFocus: false
    });
  }
}
