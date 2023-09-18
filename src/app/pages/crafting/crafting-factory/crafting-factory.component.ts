import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { minerals, userOwnedMaterials } from 'src/app/constants/craftingData';
import { getWalletMaterials } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MaterialExtractionService } from 'src/app/shared/services/lands/material-extraction.service';

@Component({
  selector: 'app-crafting-factory',
  templateUrl: './crafting-factory.component.html',
  styleUrls: ['./crafting-factory.component.scss']
})
export class CraftingFactoryComponent implements OnInit, OnDestroy {
  selectedStep: string = 'creation';
  materials: Array<any> = minerals;
  materialsQuery: any;
  querySubscription: any;
  walletIsConnected: boolean = false;
  discounts: any = { cost: 0, time: 0 };

  constructor(
    private connectionService: ConnectionService,
    private materialExtractionService: MaterialExtractionService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getDiscounts();
        this.getWalletMaterials(userAddress);
      } else {
        if (this.querySubscription) { this.querySubscription.unsubscribe(); }
      }
    });
  }

  /**
   * Ends intervals if exist
   */
  ngOnDestroy(): void {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Change the selected step
   * @param newStep step to change to
   */
  changeSelectedStep(newStep: string): void {
    this.selectedStep = newStep;
  }

  /**
   * Subscribes to query to get user materials
   * @param {string} userAddress : Address of the user wallet
   */
  async getWalletMaterials(userAddress: string): Promise<any> {
    this.materialsQuery = this.apollo.use('crafting').watchQuery({
      query: getWalletMaterials,
      pollInterval: 5000,
      variables: {
        wallet: userAddress
      }
    });
    this.querySubscription = this.materialsQuery
      .valueChanges
      .subscribe( async (data: any) => {
        console.log('Materials Query:');
        console.log(data);
        let response = data.data.usersMaterials[0];
        this.addValuesToArray(response);
      });
  }

  /**
   * Manage the data obtained from the materials query
   * @param data : Result of materials query
   */
  addValuesToArray(data: any): void {
    for (let mat of this.materials) {
      if (data) {
        userOwnedMaterials[mat.name.toLowerCase()].amount = data[mat.name.toLowerCase()];
      } else {
        userOwnedMaterials[mat.name.toLowerCase()].amount = '0';
      }
    }
  }

  /**
   *
   */
  async getDiscounts(): Promise<any> {
    this.discounts = await this.materialExtractionService.getUserCraftingDiscount();
    console.log('discounts', this.discounts);
  }
}
