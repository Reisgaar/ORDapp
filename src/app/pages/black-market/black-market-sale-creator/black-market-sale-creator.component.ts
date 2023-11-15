import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { userOwnedMaterials } from 'src/app/constants/craftingData';
import { getWalletMaterials } from 'src/app/constants/gqlQueries';
import { gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { BlackMarketService } from '../../../shared/services/black-market/black-market.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-black-market-sale-creator',
  templateUrl: './black-market-sale-creator.component.html',
  styleUrls: ['./black-market-sale-creator.component.scss']
})
export class BlackMarketSaleCreatorComponent  implements OnInit, OnDestroy {
  @Input() walletIsConnected: boolean;
  selectedMaterial: string = '';
  walletInterval: NodeJS.Timeout;
  materialsQuery: any;
  querySubscription: any;
  price: string = '0';
  gqPrice: number = 0;
  materialAmount: string = '0';
  formError: boolean = false;
  materials: any;
  materialsLoaded: boolean = false;
  saleFee: number = 0;
  userHasMaterials: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private apollo: Apollo,
    private blackMarketService: BlackMarketService,
    private dialogService: DialogService
  ) { }

  /**
   * Sets the materials and gets wallet
   */
  ngOnInit(): void {
    this.getSaleFee();
    this.walletInterval = setInterval( async () => {
      try {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getWalletMaterials(userAddress);
        clearInterval(this.walletInterval);
      } catch (error: any) { }
    }, 1000);
  }

  /**
   * Ends intervals if exist and unsubscribe from query
   */
  ngOnDestroy(): void {
    if (this.walletInterval) { clearInterval(this.walletInterval); }
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Get the fee of each sale
   */
  async getSaleFee(): Promise<any> {
    this.saleFee = await this.blackMarketService.getSaleFee();
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
        this.materials = await this.processQueryData(data.data.usersMaterials[0])
        console.log(this.materials);
        this.materialsLoaded = true;
      });
    }

  /**
   * Process the query data
   * @param queryData data from query
   * @returns array with the processed data
   */
  async processQueryData(queryData: any[]): Promise<any> {
    let totalMaterialAmount = 0;
    let data = userOwnedMaterials;
    for (let [key, value] of Object.entries(data) ) {
      value.amount = queryData[key];
      totalMaterialAmount += parseFloat(this.connectionService.fromWei(queryData[key]));
    }
    this.userHasMaterials = totalMaterialAmount > 0 ? true : false;
    return data;
  }

  /**
   * Set the selected material to the given one
   * @param mat the material to set as selected
   */
  setSelectedMaterial(mat: string): void {
    this.selectedMaterial = mat;
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    this.setGqPrice();
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

  /**
   * Sets the price of gq with BUSD conversion
   */
  setGqPrice(): void {
    this.gqPrice = parseFloat(this.price) * gqPriceOnBusd[0];
  }

  /**
   * Validates the form
   * @returns true if is valid
   */
  async validateMaterialAmount(): Promise<any> {
    this.formError = false;
    if (this.materialAmount !== '' && this.materialAmount !== '0') {
      // Transform to wei to avoid decimals and to BN to make comparison
      const selectedGqBN = await this.connectionService.ethers.utils.parseUnits(this.materialAmount, "ether");
      const totalGqBN = await this.connectionService.ethers.utils.parseUnits(this.materials[this.selectedMaterial.toLowerCase()].amount, "wei");
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
   * Creates a sale on the black market
   */
  async createBlackMarketSale(): Promise<any> {
    const materialAmountWei = this.connectionService.toWei(this.materialAmount);
    const priceWei = this.connectionService.toWei(this.price);
    this.blackMarketService.createBlackMarketSale(contractAddresses[this.selectedMaterial.toLowerCase()], materialAmountWei, priceWei).then( () => {
      this.selectedMaterial = '';
      this.materialAmount = '';
      this.price = '';
    })
  }

  getMaterialsPopUp(): void {
    this.dialogService.openGetMaterialsDialog();
  }

}
