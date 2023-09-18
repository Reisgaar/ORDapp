import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as EnglishAuction } from 'src/app/shared/contracts/marketplace/EnglishAuction.json';

/**
 * Service to manage all functions related to the english auction smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class EnglishAuctionService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Puts an NFT on auction
   * @param nftAddress : the address of the NFT contract
   * @param tokenId : the id of the token
   * @param amount : the amount of price
   * @param coin : the selected coin
   * @param auctionTime : the auction time
   * @param bidPercentage : the bid increase percentage
   * @param itemName : the name to show on pop up
   * @returns the response of the SC funcion
   */
  async putOnAuction(nftAddress: string, tokenId: number, amount: number, coin: string, auctionTime: number, bidPercentage: number, itemName: string): Promise<any> {
    const transactionCoin = await this.tokenService.getCoinAddressByTicker(coin);
    const allowance = await this.tokenService.nftCheckAllowance(contractAddresses.englishAuction, nftAddress);
    if (allowance) {
      let dialog = this.dialogService.openRegularInfoDialog('putOnAuction', 'approvePutOnAuction', itemName + ': ' + amount + ' ' + coin + '.');
      try {
        const auctionPrice = this.connectionService.toWei(amount.toString());
        const customFee = await this.getCustomAuctionFee(auctionTime);
        const args = [nftAddress, tokenId, transactionCoin, auctionPrice, auctionTime, bidPercentage];
        const tx = await this.connectionService.writeContract(contractAddresses.englishAuction, EnglishAuction.abi, 'createNewNftAuction', args, customFee);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('putOnAuction', 'waitTransaction', '');
        const res = await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('putOnAuction', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return res;
      } catch (error: any) {
        dialog.close();
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Gets the price for the custom auction fee
   * @param englishAuction : contract of the partner english auction
   * @param auctionTime : auction time
   * @returns the amount of fee
   */
  async getCustomAuctionFee(auctionTime: number): Promise<number> {
    if (auctionTime === 345600 || auctionTime === 518400) {
      const auctionData = await this.connectionService.readContract(contractAddresses.englishAuction, EnglishAuction.abi, 'mapAuctionTime', [auctionTime]);
      const price = auctionData.price;
      const fee = await this.connectionService.readContract(contractAddresses.englishAuction, EnglishAuction.abi, 'convertBUSDToBNB', [price]);
      return fee;
    } else {
      return 0;
    }
  }

  /**
   * Starts the process to add a bid on an auction (separated after for BNB or regular)
   * @param nftAddress : the address of the NFT smart contract
   * @param tokenId : the id of the token
   * @param amount : the amount of the bid
   * @param coin : the coin used
   * @param itemName : the item name to show on pop up
   * @returns the response of the making bid function
   */
  async addBid(nftAddress: string, tokenId: number, amount: number, coin: string, itemName: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const bidAmount = this.connectionService.toWei(amount.toString());
    const isApproved = await this.tokenService.tokenApprovement(contractAddresses.englishAuction, userAddr, coin, bidAmount);
    if (isApproved) {
      let dialog = this.dialogService.openRegularInfoDialog('bidForNft', 'approveBidForNft', itemName + ': ' + amount + ' ' + coin + '.');
      try {
        if (coin === 'BNB') { return await this.makeBNBBid(nftAddress, tokenId, bidAmount, dialog); }
        else { return await this.makeRegularBid(nftAddress, tokenId, bidAmount, dialog); }
      } catch (error: any) {
          dialog.close();
          this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Finishes the bid for a regular coin
   * @param englishAuction : the contract of partner english auction
   * @param nftAddress : the address of the NFT
   * @param tokenId : the token id
   * @param bidAmount : the amount to bid
   * @param dialog : dialog to manage the pop ups
   * @returns : the response of the function
   */
  async makeRegularBid(nftAddress: string, tokenId: number, bidAmount: string, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.englishAuction, EnglishAuction.abi, 'makeBid', [nftAddress, tokenId, bidAmount]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bidForNft', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bidForNft', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Finishes the bid for BNB
   * @param englishAuction : the contract of partner english auction
   * @param nftAddress : the address of the NFT
   * @param tokenId : the token id
   * @param bidAmount : the amount to bid
   * @param dialog : dialog to manage the pop ups
   * @returns : the response of the function
   */
  async makeBNBBid(nftAddress: string, tokenId: number, bidAmount: string, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.englishAuction, EnglishAuction.abi, 'makeBNBBid', [nftAddress, tokenId], bidAmount);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bidForNft', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bidForNft', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets the data of an auction
   * @param id : the id of the token
   * @param nftAddress : the address of the NFT smart contract
   * @returns : the data of the auction
   */
  async getAuctionData(id: number, nftAddress: string): Promise<any> {
    try {
      return await this.connectionService.readContract(contractAddresses.englishAuction, EnglishAuction.abi, 'nftContractAuctions', [nftAddress, id]);
    } catch (error: any) {
      return '';
    }
  }

  /**
   * Withdraws an NFT from a finished auction
   * @param id : the id of the NFT
   * @param nftAddress : the address of the NFT smart contract
   * @returns : the response of the withdraw function
   */
  async withdrawAuction(id: number, nftAddress: string): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('withdrawNft', 'approveToWithdraw', '');
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.englishAuction, EnglishAuction.abi, 'settleAuction', [nftAddress, id]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('withdrawNft', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('withdrawNft', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
      return '';
    }
  }
}
