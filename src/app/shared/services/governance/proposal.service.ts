import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { Proposal } from 'src/app/interfaces/proposal';
import { TokenService } from '../token/token.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../dialog.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as VoteManager } from 'src/app/shared/contracts/governance/VoteManager.json';

/**
 * Service to manage all functions related to proposals smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  async getProposalData(proposalId: number): Promise<any> {
    const data = await this.connectionService.readContract(contractAddresses.voteManager, VoteManager.abi, 'proposalsMap', [proposalId]);
    const metadata = await fetch(data.proposalURI).then((response) => response.json());
    return metadata;
  }

  /**
   * Uploads a proposal to the contract
   * @param {string} jsonUri : uri with the proposal json
   * @param {number} options : amount of voting options
   * @param {number} startTimestamp : start of the proposal
   * @param {number} endTimestamp : end of the proposal
   */
  async uploadProposal(jsonUri: string, options: number, startTimestamp: number, endTimestamp: number): Promise<any> {
    try {
      const walletIsConnected = await this.connectionService.isWalletConnected();
      if (walletIsConnected) {
        const tx = await this.connectionService.writeContract(contractAddresses.voteManager, VoteManager.abi, 'createProposal' , [jsonUri, options, startTimestamp, endTimestamp])
        await waitForTransaction(tx);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Gets all votes of a proposal
   * @param {any} proposal : proposals contract
   * @param {number} proposalId : id of the proposal
   * @param {number} answers : amount of answers
   * @returns {Array<number>} : array with the amount of votes
   */
  async getProposalVotes(proposalId: number, answers: number): Promise<Array<number>> {
    try {
      let votes = [];
      for (let option = 0; option < answers; option++) {
        const voteWei = await this.connectionService.readContract(contractAddresses.voteManager, VoteManager.abi, 'answerVotesByProposal', [proposalId, option]);
        const vote = this.connectionService.fromWei(voteWei);
        votes.push(vote);
      }
      return votes;
    } catch (error: any) {
      console.log(error);
    }

  }

  /**
   * Votes on a proposal
   * @param {number} vote : number of the option to vote on
   * @param {Proposal} proposal : the proposal to vote on
   * @param {numb} amount : the amount of VP to vote
   * @returns {boolean} : true if vote is done, false if not done
   */
  async voteProposal(vote: number, proposal: Proposal, amount: number): Promise<boolean> {
    const userAddr = this.connectionService.getWalletAddress();
    const amountWei = this.connectionService.toWei(amount.toString());
    const allowed = await this.tokenService.tokenApprovement(contractAddresses.voteManager, userAddr, 'ORVP', amountWei);
    let voted = false;
    if (allowed) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmVotingTransaction', '');
      try {
        console.log(proposal.proposalId);
        console.log(amountWei);
        console.log(vote);
        const tx = await this.connectionService.writeContract(contractAddresses.voteManager, VoteManager.abi, 'vote', [proposal.proposalId, amountWei, vote]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('waitVote', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        voted = true;
        dialog = this.dialogService.openRegularInfoDialog('waitVote', 'voteAdded', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        this.dialog.closeAll();
        console.log(error);
        this.dialogService.openRegularInfoDialog('error', error.message, '');
        voted = false;
      }
    }
    return voted;
  }

  /**
   * Pay 200VP to send a proposal to the team
   * @returns {boolean} : true if proposal is sent correctly
   */
  async payToSendProposal(): Promise<boolean> {
    const userAddr = this.connectionService.getWalletAddress();
    const allowed = await this.tokenService.tokenApprovement(contractAddresses.voteManager, userAddr, 'ORVP', '200000000000000000000');
    if (allowed) {
      const dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmProposalSendTransaction', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.voteManager, VoteManager.abi, 'userProposal', []);
        await waitForTransaction(tx);
        dialog.close();
        return true;
      } catch (error: any) {
        dialog.close();
        this.dialogService.openRegularInfoDialog('error', error.message, '');
        return false;
      }
    }
    return false;
  }

  /**
   * Parse metadata of each proposal of the array
   * @param data : Proposals array from the query
   * @returns {Array} : The array with procesed Proposals
   */
  async parseProposals(data: Array<any>): Promise<Array<any>> {
    const newArray = [];
    for (let prop of data) {
      try {
        const metadata = {
          ...prop,
          ...JSON.parse(prop.metadata.uriString)
        };
        metadata.eachVote = metadata.votes;
        metadata.votes = await this.processVotes(metadata.votes, metadata.votingOptions);
        newArray.push(metadata);
      } catch (error: any) {
        const metadata = {...prop, title: 'Error', description: 'Some error happened loading the proposal from Graph.'}
        newArray.push(metadata);
        console.log(error);
      }
    }
    return newArray;
  }

  async processVotes(votes: any[], answers: any[]): Promise<any[]> {
    let processedVotes: number[] = [];
    for (let ans of answers) {
      processedVotes.push(0)
    }
    for (let vote of votes) {
      const amount = parseFloat(this.connectionService.fromWei(vote.amount));
      processedVotes[vote.answer] += amount;
    }
    return processedVotes;
  }
}
