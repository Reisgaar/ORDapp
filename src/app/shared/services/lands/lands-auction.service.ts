import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as LandsEnglishAuctionWL } from 'src/app/shared/contracts/lands/LandsEnglishAuctionWL.json';
import { default as LandsEnglishAuction } from 'src/app/shared/contracts/lands/LandsEnglishAuction.json';

/**
 * Service to manage the connection with the lands smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class LandsAuctionService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Gets the data of an auctioned land
   * @param counter the id of the auction
   * @param auctionContractAddress the address of the auction contract (different for whitelisted or not whitelisted)
   * @returns returns the auction data
   */
  async getLandAuctionData(counter: number, auctionContractAddress: string): Promise<any> {
    try {
      const userAddr = this.connectionService.getWalletAddress();
      const data = await this.connectionService.readContract(auctionContractAddress , LandsEnglishAuction.abi, 'auctionsMap', [counter]);
      const buyout = await this.connectionService.readContract(auctionContractAddress , LandsEnglishAuction.abi, 'calcBuyOut', [counter]);
      const buyoutStartTime = await this.connectionService.readContract(auctionContractAddress , LandsEnglishAuction.abi, 'buyOutUserLockTimeMap', [userAddr]);
      const nextBidStartTime = await this.connectionService.readContract(auctionContractAddress , LandsEnglishAuction.abi, 'bidUserLockTimeMap', [userAddr]);
      const allData = {
        bidIncreasePercentageInBP: data.bidIncreasePercentageInBP.toString(),
        buyOutPercentageInBP: data.buyOutPercentageInBP.toString(),
        endTime: data.endTime.toString(),
        erc20Token: data.erc20Token,
        highestBid: data.highestBid.toString(),
        highestBidder: data.highestBidder,
        landId: data.landId.toString(),
        minBuyOutPrice: data.minBuyOutPrice.toString(),
        startPrice: data.startPrice.toString(),
        startTime: data.startTime.toString(),
        actualBuyout: buyout.toString(),
        buyoutStartTimeStamp: buyoutStartTime.toString(),
        nextBidStartTimeStamp: nextBidStartTime.toString()
      }

      return allData;
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Prepares the bib/buyout process
   * @param isBuyout true if is buyout, false if is bid
   * @param nft the nft data
   * @param amountInWei the bid/buyout amount in wei
   * @param nftContractAddress the contract address of the nft for the whitelist
   * @param whitelistedTokenId the id of the nft to access the whitelist
   * @param itemName the name of the item to show on the pop up
   */
  async landBidOrBuy(isBuyout: boolean, nft: any, amountInWei: string, nftContractAddress: string, whitelistedTokenId: number, itemName: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const coinTicker = await this.tokenService.getCoinTickerByAddress(nft.erc20Token);
    let isApproved: boolean;
    if (nft.auctionContract.toLowerCase() === contractAddresses.landsEnglishAuction.toLowerCase()) {
      isApproved = await this.tokenService.tokenApprovement(contractAddresses.landsEnglishAuction, userAddr, coinTicker, amountInWei);
    } else {
      isApproved = await this.tokenService.tokenApprovement(contractAddresses.landsEnglishAuctionWL, userAddr, coinTicker, amountInWei);
    }
    const shownAmount = parseFloat(this.connectionService.fromWei(amountInWei));
    if (isApproved) {
      let dialog = this.dialogService.openRegularInfoDialog('followInstructions', 'followInstructionsText', '');
      try {
        if (isBuyout) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('buyoutLand', 'buyoutLandText', itemName + ': ' + shownAmount + ' ' + coinTicker + '.');
          if (nft.auctionContract.toLowerCase() === contractAddresses.landsEnglishAuction.toLowerCase()) {
            await this.buyout(parseInt(nft.counter, 0), parseInt(nft.tokenId, 0), amountInWei, dialog);
          } else {
            await this.buyoutWL(parseInt(nft.counter, 0), parseInt(nft.tokenId, 0), amountInWei, nftContractAddress, whitelistedTokenId, dialog);
          }
        } else {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('bidForLand', 'bidForLandText', itemName + ': ' + shownAmount + ' ' + coinTicker + '.');
          if (nft.auctionContract.toLowerCase() === contractAddresses.landsEnglishAuction.toLowerCase()) {
            return await this.addBid(parseInt(nft.counter, 0), parseInt(nft.tokenId, 0), amountInWei, dialog);
          } else {
            return await this.addBidWL(parseInt(nft.counter, 0), parseInt(nft.tokenId, 0), amountInWei, nftContractAddress, whitelistedTokenId, dialog);
          }
        }
      } catch (error: any) {
          dialog.close();
          this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Makes the bid on an NFT auction for not whitelisted tokens
   * @param userAddr the wallet of the user
   * @param auctionCounter the id of the auction
   * @param tokenId the id of the land token
   * @param bidAmountInWei the amount of the bid on weis
   * @param dialog the pop ups show during the process
   * @returns the result of the transaction
   */
  async addBid(auctionCounter: number, tokenId: number, bidAmountInWei: string, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.landsEnglishAuction, LandsEnglishAuction.abi, 'makeBid', [auctionCounter, tokenId, bidAmountInWei]);
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
   * Makes the buyout on an NFT auction for not whitelisted tokens
   * @param userAddr the wallet of the user
   * @param auctionCounter the id of the auction
   * @param tokenId the id of the land token
   * @param buyoutInWei the amount of the buyout on weis
   * @param dialog the pop ups show during the process
   * @returns the result of the transaction
   */
  async buyout(auctionCounter: number, tokenId: number, buyoutInWei: string, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.landsEnglishAuction, LandsEnglishAuction.abi, 'buyOut', [auctionCounter, tokenId, buyoutInWei]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('buyoutLand', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('buyoutLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Makes the bid on an NFT auction for whitelisted tokens
   * @param userAddr the wallet of the user
   * @param auctionCounter the id of the auction
   * @param tokenId the id of the land token
   * @param bidAmountInWei the amount of the bid on weis
   * @param nftContractAddress the contract address of the nft for the whitelist
   * @param whitelistedTokenId the id of the nft to access the whitelist
   * @param dialog the pop ups show during the process
   * @returns the result of the transaction
   */
  async addBidWL(auctionCounter: number, tokenId: number, bidAmountInWei: string, nftContractAddress: string, whitelistedTokenId: number, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.landsEnglishAuctionWL, LandsEnglishAuctionWL.abi, 'makeBid', [auctionCounter, tokenId, bidAmountInWei, nftContractAddress, whitelistedTokenId]);
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
   * Makes the buyout on an NFT auction for whitelisted tokens
   * @param userAddr the wallet of the user
   * @param auctionCounter the id of the auction
   * @param tokenId the id of the land token
   * @param buyoutInWei the amount of the buyout on weis
   * @param nftContractAddress the contract address of the nft for the whitelist
   * @param whitelistedTokenId the id of the nft to access the whitelist
   * @param dialog the pop ups show during the process
   * @returns the result of the transaction
   */
  async buyoutWL(auctionCounter: number, tokenId: number, buyoutInWei: string, nftContractAddress: string, whitelistedTokenId: number, dialog: any): Promise<any> {
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.landsEnglishAuctionWL, LandsEnglishAuctionWL.abi, 'buyOut', [auctionCounter, tokenId, buyoutInWei, nftContractAddress, whitelistedTokenId]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('buyoutLand', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('buyoutLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Withdraws an NFT from finished auction
   * @param id the id of the auction
   * @returns the result of the transaction
   */
  async withdrawAuction(id: number, nft: any): Promise<any> {
    console.log(nft);
    let dialog = this.dialogService.openRegularInfoDialog('withdrawLand', 'approveToWithdrawLand', '');
    try {
      const tx = await this.connectionService.writeContract(nft.auctionContract, LandsEnglishAuction.abi, 'settleAuction', [id]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('withdrawLand', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('withdrawLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
      return '';
    }
  }
}
