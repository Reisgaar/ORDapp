import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { DialogService } from '../dialog.service';
// Abi
import { default as MaterialsSales } from 'src/app/shared/contracts/blackMarket/MaterialsSales.json';
import { waitForTransaction } from '@wagmi/core';

@Injectable({
  providedIn: 'root'
})
export class BlackMarketService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Gets the fee of the material sale
   * @returns fee in number
   */
  async getSaleFee(): Promise<number> {
    const feeInBP = await this.connectionService.readContract(contractAddresses.materialsSales, MaterialsSales.abi, 'feeInBP', []);
    return parseInt(feeInBP) / 100;
  }

  /**
   * Creates a material sale on the black market
   * @param materialAddress the address of the material
   * @param materialAmountWei the amount material to sale on wei
   * @param priceInGqWei the gq price on wei
   */
  async createBlackMarketSale(materialAddress: string, materialAmountWei: string, priceInGqWei: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const materialAllowed = await this.tokenService.tokenApprovement(contractAddresses.materialsSales, userAddr, materialAddress, materialAmountWei);
      if (!materialAllowed) { return }
      const gqAllowed = await this.tokenService.tokenApprovement(contractAddresses.materialsSales, userAddr, contractAddresses.gq, priceInGqWei);
      if (!gqAllowed) { return }
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmMaterialSaleCreation', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.materialsSales, MaterialsSales.abi, 'createSale', [materialAddress, materialAmountWei, priceInGqWei]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('materialSaleCreation', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('materialSaleCreation', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Removes the sale of the given sale id
   * @param saleId the id of the sale
   */
  async removeSale(saleId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmSaleRemoving', '');
      try {
          const tx = await this.connectionService.writeContract(contractAddresses.materialsSales, MaterialsSales.abi, 'withdrawSale', [saleId], );
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('saleRemoving', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('saleRemoving', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Buy the given id material sale
   * @param saleId the id of the sale
   * @param priceOnWei the gq price on wei
   * @param materialName the name of the material
   * @param materialAmountWei the amount of the material
   */
  async buyMaterials(saleId: number, priceOnWei: string, materialName: string, materialAmountWei: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
        const userAddr = this.connectionService.getWalletAddress();
        const tokenAllowed = await this.tokenService.tokenApprovement(contractAddresses.materialsSales, userAddr, contractAddresses.gq, priceOnWei);
        if (tokenAllowed) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmMaterialBuy', materialName + ' ' + this.connectionService.fromWei(materialAmountWei).toString() + ' -> ' + this.connectionService.fromWei(priceOnWei) + ' GQ');
        try {
            const tx = await this.connectionService.writeContract(contractAddresses.materialsSales, MaterialsSales.abi, 'buyMaterials', [saleId], );
            dialog.close();
            dialog = this.dialogService.openRegularInfoDialog('materialBuy', 'waitTransaction', '');
            await waitForTransaction(tx);
            dialog.close();
            dialog = this.dialogService.openRegularInfoDialog('materialBuy', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
            dialog.close();
            dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
        }
    }
  }

}
