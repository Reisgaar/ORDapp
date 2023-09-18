import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CurrentVotesForUserByProposalId } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { ProposalService } from 'src/app/shared/services/governance/proposal.service';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';

/**
 * Detail page of a proposal
 */
@Component({
  selector: 'app-governance-proposal-detail',
  templateUrl: './governance-proposal-detail.component.html',
  styleUrls: ['./governance-proposal-detail.component.scss']
})
export class GovernanceProposalDetailComponent implements OnInit, OnDestroy {
  proposalId: number;
  proposal: any;
  votes: string[];
  totalVotes = 0;
  result: string;
  proposalStatus = '';
  proposalEnd = '';
  interval: any;
  userVotes: any = [];
  votesQuery: any;
  querySubscription: any;
  userTotalVotes: number = 0;
  loadingProposal: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService,
    private governanceDialogService: GovernanceDialogService,
    private datePipe: DatePipe,
    private connectionService: ConnectionService,
    private apollo: Apollo
  ) {
    try {
      this.activatedRoute.queryParams.subscribe( (params: any) => {
        this.proposalId = params.id;
        if (!isNaN(this.proposalId)) {
          this.proposalId = parseInt(params.id, 0);
          console.log(this.proposalId);
        }
      });
    } catch (error: any) {
      this.router.navigate(['/governance/proposals']);
    }
  }

  ngOnInit(): void {
    this.loadProposal();
    this.interval = setInterval(async () => {
      this.proposal.votes = await this.proposalService.getProposalVotes(this.proposalId, this.proposal.votingOptions.length);
    }, 20000);
  }


  /**
   * Clears interval and subscription if exist
   */
  ngOnDestroy(): void {
    this.userVotes = [];
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
    if (this.interval) { clearInterval(this.interval); }
  }

  async loadProposal(): Promise<any> {
    try {
      await this.getProposalData();
      this.getProposalStatus(this.proposal.startTimeStamp, this.proposal.endTimeStamp);
      this.loadingProposal = false;
      clearInterval(this.interval);
      this.getVotesSubscription();
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Gets proposals data
   */
  async getProposalData(): Promise<any> {
    try {
      this.proposal = await this.proposalService.getProposalData(this.proposalId);
      this.proposal.votes = await this.proposalService.getProposalVotes(this.proposalId, this.proposal.votingOptions.length);
      this.proposal.proposalId = this.proposalId;
      this.getTotalVotes();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets total votes of each proposal
   */
  async getTotalVotes(): Promise<void> {
    let loadVotes = 0;
    for (const votes of this.proposal.votes) {
      loadVotes += parseFloat(votes);
    }
    this.totalVotes = loadVotes;
  }

  /**
   * Gets proposal status (coming, active or closed)
   * @param {string} start : The start timestamp of the proposal
   * @param {string} end : The end timestamp of the proposal
   */
  getProposalStatus(start: string, end: string): void {
    try {
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
    } catch (error) {
      console.log(error);
    }

  }

  /**
   * Sets proposal result to show on view
   */
  setProposalResult(): void {
    let winner = 0;
    let winnerString = '';
    for (const vote of this.proposal.votes) {
      const voteNumber = parseInt(vote, 0);
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
          const minutes = data.getMinutes();
          const hours = data.getHours();
          this.proposalEnd = 'Ends today at ' + this.datePipe.transform(data, 'hh:mm');
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
  async voteOnProposal(vote: string): Promise<void> {
    console.log(this.proposal);
    console.log(vote);
    const voteId = this.proposal.votingOptions.indexOf(vote);
    this.governanceDialogService.openVotingDialog(voteId, this.proposal).afterClosed().subscribe( (res: any) => {
      if (res) {
        this.proposalService.voteProposal(voteId, this.proposal, res).then( async (response) => {
          if (response === true) {
            this.proposal.votes = await this.proposalService.getProposalVotes(this.proposalId, this.proposal.votingOptions.length);
            this.getTotalVotes();
          }
        });
      }
    });
  }

  /**
   * Get votes of proposal with apollo query subscription
   */
  async getVotesSubscription(): Promise<void> {
    const userAddress = this.connectionService.getWalletAddress().toLowerCase();
    this.votesQuery = this.apollo.use('governance').watchQuery({
      query: CurrentVotesForUserByProposalId,
      pollInterval: 500,
      variables: {
        proposalId: this.proposalId,
        user: userAddress
      }
    });
    this.querySubscription = this.votesQuery
      .valueChanges
      .subscribe( async (data: any) => {
        this.setVotesArray(data);
      });
  }

  /**
   * Sets the result of the votes query
   * @param {any} data : the result of the votes query
   */
  async setVotesArray(data: any): Promise<void> {
    this.userVotes = [];
    this.userTotalVotes = 0;
    for (let vote of data.data.votes) {
      const answer = this.proposal.votingOptions[parseInt(vote.answer, 0)];
      const amount = this.connectionService.fromWei(vote.amount);
      const newVote = { answer, amount };
      this.userTotalVotes += parseFloat(amount);
      this.userVotes.push(newVote);
    }
    console.log(this.userVotes);
  }

  /**
   * Refresh the vote query
   */
  refresh(): void {
    this.votesQuery.refetch();
  }
}
