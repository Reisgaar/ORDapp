import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProposalService } from 'src/app/shared/services/governance/proposal.service';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';

/**
 * Proposal card to load on proposal list
 */
@Component({
  selector: 'app-governance-proposal-card',
  templateUrl: './governance-proposal-card.component.html',
  styleUrls: ['./governance-proposal-card.component.scss']
})
export class GovernanceProposalCardComponent implements OnInit, OnDestroy {
  @Input() proposal: any;
  votes: string[];
  totalVotes = 0;
  result: string;
  proposalStatus = '';
  proposalEnd = '';
  voted = false;
  interval: any;


  constructor(
    private proposalService: ProposalService,
    private governanceDialogService: GovernanceDialogService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.votes = this.proposal.votes;
    this.result = this.proposal.result;
    this.getTotalVotes();
    this.getProposalStatus(this.proposal.startTimeStamp, this.proposal.endTimeStamp);
  }

  /**
   * Clears interval if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets total votes on the proposal
   */
  async getTotalVotes(): Promise<void> {
    let loadVotes = 0;
    for (const votes of this.proposal.votes) {
      loadVotes += parseFloat(votes);
    }
    this.totalVotes = loadVotes;
  }

  /**
   * Gets the proposal status (comming, active or closed)
   * @param {string} start : The start timestamp
   * @param {string} end : The end timestamp
   */
  getProposalStatus(start: string, end: string): void {
    const startNum = parseInt(start, 0);
    const endNum = parseInt(end, 0);
    const now = Date.now() / 1000;
    if (endNum > now) {
      if (startNum > now) {
        this.proposalStatus = 'Coming';
      } else {
        this.proposalStatus = 'Active';
      }
    } else {
      this.proposalStatus = 'Closed';
      this.setProposalResult();
    }
    this.getEndData(this.proposalStatus, startNum, endNum, now);
  }

  /**
   * Sets the proposal result
   */
  setProposalResult(): void {
    let winner = 0;
    let winnerString = '';
    for (const vote of this.proposal.votes) {
      const voteNumber = parseFloat(vote);
      if (voteNumber > winner) {
        winner = voteNumber;
        winnerString = vote;
      }
    }
    this.result = winnerString;
  }

  /**
   * Gets the date to show on the proposal card
   * @param {string} status : The proposal statur (comming, active or closed)
   * @param {number} startNum : The start timestamp
   * @param {number} endNum : The end timestamp
   * @param {number} now : Actual timestamp
   */
  getEndData(status: string, startNum: number, endNum: number, now: number): void {
    let data: any;
    switch (status) {
      case 'Coming':
        data = new Date(startNum * 1000);
        this.proposalEnd = 'Starts on ' + this.datePipe.transform(data, 'dd/MM/yyyy');
        break;
      case 'Active':
        data = Math.floor((endNum - now) / (3600 * 24));
        if (data > 0) {
          if (data === 1) {
            this.proposalEnd = data + ' day left';
          } else {
            this.proposalEnd = data + ' days left';
          }
        } else {
          data = new Date(endNum * 1000);
          this.proposalEnd = 'Ends today at ' + this.datePipe.transform(data, 'hh:mm a');
        }
        break;
      case 'Closed':
        data = new Date(endNum * 1000);
        this.proposalEnd = 'Ended on ' + this.datePipe.transform(data, 'dd/MM/yyyy');
        break;
    }
  }

  /**
   * Fuction to vote on a proposal
   * @param {any} event : The click event
   * @param {string} vote : The selected vote
   */
  async voteOnProposal(event: any, vote: string): Promise<void> {
    event.stopPropagation();
    const voteId = this.proposal.votingOptions.indexOf(vote);
    this.governanceDialogService.openVotingDialog(voteId, this.proposal).afterClosed().subscribe( (res: any) => {
      if (res) {
        this.proposalService.voteProposal(voteId, this.proposal, res).then( response => {
          if (response === true) {
            this.voted = true;
          }
        });
      }
    });
  }

}
