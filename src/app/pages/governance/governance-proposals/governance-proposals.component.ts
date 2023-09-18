import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { getGovernanceProposals } from 'src/app/constants/gqlQueries';
// Data
import { ProposalService } from 'src/app/shared/services/governance/proposal.service';

/**
 * Page of proposals list
 */
@Component({
  selector: 'app-governance-proposals',
  templateUrl: './governance-proposals.component.html',
  styleUrls: ['./governance-proposals.component.scss']
})
export class GovernanceProposalsComponent implements OnInit, OnDestroy {
  shownProposals = [];
  propsPerPage: number = 4;
  paginationPage: number = 0;
  totalPages: number = 1;
  time = new Date();
  selectedFilter = 'all';
  dataLoading = true;
  subscription: Subscription;
  proposals: any[];
  proposalsQuery: any;
  proposalsQuerySubscription: any;

  constructor(
    private apollo: Apollo,
    private proposalService: ProposalService
  ) { }

  /**
   * Get all the proposals from graph
   */
  ngOnInit(): void {
    this.getProposals();
  }

  /**
   * Unsubscribes the subscription
   */
  ngOnDestroy(): void {
  }

  /**
   * Subscribes to the lands query
   * @param userAddress the wallet of the user
   */
  getProposals(): any {
    this.proposalsQuery = this.apollo.use('governance').watchQuery({
      query: getGovernanceProposals,
      pollInterval: 5000,
    });
    this.proposalsQuerySubscription = this.proposalsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        this.dataLoading = false;
        console.log(res);
        await this.manageProposalsData(res.data.createProposals);
        this.filter(this.selectedFilter);
      });
  }

  /**
   * Parse the data to show on view
   */
  async manageProposalsData(frozenData: any[]): Promise<any> {
    let data = JSON.parse( JSON.stringify( frozenData ) );
    this.proposals = await this.proposalService.parseProposals(data);
    console.log(this.proposals);
  }

  /**
   * Filter data by timeStamp
   */
  filter(type: string): void {
    if (this.selectedFilter !== type) {
      this.paginationPage = 0;
    }
    const seconds = this.time.getTime() / 1000;
    this.selectedFilter = type;
    switch (type) {
      case 'all':
        this.shownProposals = this.proposals;
        break;
      case 'active':
        this.shownProposals = this.proposals.filter( (obj) => {
          return obj.endTimeStamp > seconds && obj.startTimeStamp < seconds;
        });
        break;
      case 'coming':
        this.shownProposals = this.proposals.filter( (obj) => {
          return obj.startTimeStamp > seconds;
        });
        break;
      case 'closed':
        this.shownProposals = this.proposals.filter( (obj) => {
          return obj.endTimeStamp < seconds;
        });
        break;
    }
    this.setTotalPages();
  }

  /**
   * Pagination
   */
  changePage(isNext: boolean): void {
    let movement = 1;
    if (!isNext) { movement = -1; }
    this.paginationPage += movement;
  }

  /**
   * Set the total page amount
   */
  setTotalPages(): void {
    this.totalPages = Math.ceil(this.shownProposals.length / this.propsPerPage) - 1;
  }

}
