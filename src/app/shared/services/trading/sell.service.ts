import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as BuySell } from 'src/app/shared/contracts/marketplace/BuySell.json';
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';

/**
 * Service to manage all functions related to the sales smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class SellService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    public dialog: MatDialog,
    private dialogService: DialogService
  ) { }

  /**
   * Puts an NFT on sale
   * @param nftAddress : the address of the NFT contract
   * @param tokenId : the id of the token
   * @param amount : the amount of price
   * @param coin : the selected coin
   * @param itemName : the name to show on pop up
   * @returns the response of the SC funcion
   */
  async putOnSale(nftAddress: string, tokenId: number, amount: number, coin: string, itemName: string): Promise<any> {
    const transactionCoin = await this.tokenService.getCoinAddressByTicker(coin);
    const allowance = await this.tokenService.nftCheckAllowance(contractAddresses.buySell, nftAddress);
    if (allowance) {
      let dialog = this.dialogService.openRegularInfoDialog('putOnSale', 'approvePutOnSale', itemName + ': ' + amount + ' ' + coin + '.');
      try {
        const buyPrice = this.connectionService.toWei(amount.toString());
        const args = [nftAddress, tokenId, transactionCoin, buyPrice];
        const tx = await this.connectionService.writeContract(contractAddresses.buySell, BuySell.abi, 'createSale', args);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('putOnSale', 'waitTransaction', '');
        const res = await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('putOnSale', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return res;
      } catch (error: any) {
        dialog.close();
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Removes an NFT from sale
   * @param nftAddress : the address of the NFT contract
   * @param tokenId : the id of the token
   * @param itemName : the name to show on pop up
   * @returns the response of the SC funcion
   */
  async removeFromSale(nftAddress: string, tokenId: number, itemName: string): Promise<any> {
    const allowance = await this.tokenService.nftCheckAllowance(contractAddresses.buySell, nftAddress);
    if (allowance) {
      let dialog = this.dialogService.openRegularInfoDialog('removeItem', 'approveRemoveFromSale', itemName);
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.buySell, BuySell.abi, 'withdrawSale', [nftAddress, tokenId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('removeItem', 'waitTransaction', '');
        const res = await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('removeItem', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return res;
      } catch (error: any) {
        dialog.close();
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Transfers directly an NFT to other wallet
   * @param sendTo : the wallet address destination of the NFT
   * @param tokenId : the id of the token
   * @param contractAddress : the address of the nft contract
   * @param itemName : the name to show on pop up
   * @returns the response of the SC funcion
   */
  async directTransfer(sendTo: string, tokenId: number, contractAddress: string, itemName: string): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('directTransfer', 'approveSendNft', itemName + ' -> ' + sendTo);
    try {
      const userAddr = this.connectionService.getWalletAddress();
      const tx = await this.connectionService.writeContract(contractAddress, ERC721.abi, 'safeTransferFrom', [userAddr, sendTo, tokenId]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('directTransfer', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('directTransfer', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      console.log(error);
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }

  }

  /**
   * Sets the sale price of an NFT on sale
   * @param nftAddress : the address of the NFT contract
   * @param tokenId : the id of the token
   * @param newPrice : the new amount of price
   * @param ticker : the ticker of the coin
   * @returns the response of the SC funcion
   */
  async setSalePrice(nftAddress: string, tokenId: number, newPrice: number, ticker: string): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('priceChange', 'approveChangePrice', newPrice + ' ' + ticker + '.');
    try {
      const updatedPrice = this.connectionService.toWei(newPrice.toString());
      const tx = await this.connectionService.writeContract(contractAddresses.buySell, BuySell.abi, 'updateBuyPrice', [nftAddress, tokenId, updatedPrice]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('priceChange', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('priceChange', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Buys a NFT that it's on sale
   * @param nftAddress : the address of the NFT contract
   * @param tokenId : the id of the token
   * @param amount  : the amount of price
   * @param itemName : the name to show on pop up
   * @param ticker : the ticker of the coin
   * @param sendTo : the wallet address destination of the NFT
   * @returns the response of the SC funcion
   */
  async buyNft(nftAddress: string, tokenId: string, amount: string, itemName: string, ticker: string, sendTo: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const buyPrice = parseFloat(this.connectionService.fromWei(amount)).toString();
    const isApproved = await this.tokenService.tokenApprovement(contractAddresses.buySell, userAddr, ticker, amount);
    if (isApproved) {
      let dialog = this.dialogService.openRegularInfoDialog('confirmBuying', 'approveBuy', itemName + ': ' + buyPrice + ' ' + ticker + '.');
      try {
        let res: any;
        if (sendTo === '') { sendTo = userAddr; }
        if (ticker !== 'BNB') {
          const tx = await this.connectionService.writeContract(contractAddresses.buySell, BuySell.abi, 'buyWithTokens', [nftAddress, tokenId, sendTo]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('confirmBuying', 'waitTransaction', '');
          res = await waitForTransaction(tx);
        } else {
          const tx = await this.connectionService.writeContract(contractAddresses.buySell, BuySell.abi, 'buyWithBNB', [nftAddress, tokenId, sendTo], amount);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('confirmBuying', 'waitTransaction', '');
          res = await waitForTransaction(tx);
        }
        dialog.close();
        return res;
      } catch (error: any) {
        dialog.close();
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Gets the data of an NFT sale
   * @param id : the id of the NFT
   * @param nftAddress : the NFT smart contract address
   * @returns : the data of the NFT sale
   */
  async getSaleData(id: number, nftAddress: string): Promise<any> {
    try {
      return await this.connectionService.readContract(contractAddresses.buySell, BuySell.abi, 'nftContractSales', [nftAddress, id]);
    } catch (error: any) {
      return '';
    }
  }
}
