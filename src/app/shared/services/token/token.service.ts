import { Injectable } from '@angular/core';
import { MaxUint256 } from '@ethersproject/constants';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { NftService } from '../nft/nft.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import {default as BEP20} from 'src/app/shared/contracts/token/BEP20.json';
import {default as ERC721} from 'src/app/shared/contracts/nft/ERC721.json';

/**
 * Service to manage all functions related to the tokens
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private nftService: NftService
  ) { }

  /**
   * Gets balance of the given token
   * @param tokenAddress the address of the token to read
   * @returns : amount of balance
   */
  async getBalanceOfToken(tokenAddress: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    try {
      // const userAddr = this.connectionService.getWalletAddress();
      return await this.connectionService.readContract(tokenAddress, BEP20.abi,'balanceOf', [userAddr]);
    } catch (error: any) {
      if(!userAddr) return 'Please connect your wallet';
      return 'Insufficient liquidity';
    }
  }

  /**
   * Gets balance of the given token
   * @param tokenAddress the address of the token to read
   * @param spenderAddress the address of the token to read
   * @returns : amount of balance
   */
  async getTokenAllowanceOnSpender(tokenAddress: string, spenderAddress: string): Promise<any> {
    try {
      const userAddr = this.connectionService.getWalletAddress();
      return await this.connectionService.readContract(tokenAddress, BEP20.abi, 'allowance', [userAddr, spenderAddress]);
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Gets the total supply of the given token
   * @param tokenAddress the address of the token to read
   * @returns : the total supply
   */
  async getTokenTotalSupply(tokenAddress: string): Promise<any> {
    try {
      return await this.connectionService.readContract(tokenAddress, BEP20.abi, 'totalSupply', []);
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Manage the approvement of an ERC20 token, check and if not done, do the approvement
   * @param spender : the contrat is going to spend tokens
   * @param userAddr : user address
   * @param tokenToSpend : token is goint to be spent
   * @returns : true if is approved
   */
  async tokenApprovement(spender: string, userAddr: string, tokenToSpend: number | string, amountOnWei: string): Promise<any> {
    let isApproved = false;
    if (tokenToSpend !== 'BNB') {
      isApproved = await this.checkApproved(spender, userAddr, tokenToSpend, amountOnWei);
      if (!isApproved) {
        isApproved = await this.tokenApprove(spender, tokenToSpend);
      }
    } else {
      isApproved = true;
    }
    return isApproved;
  }

  /**
   * Check if spender is approved
   * @param spender : the contrat is going to spend tokens
   * @param userAddr : user address
   * @param tokenToSpend : token is goint to be spent
   * @returns : true if is approved
   */
  async checkApproved(spender: string, userAddr: string, tokenToSpend: number | string, amountOnWei: string): Promise<any> {
    try {
      console.log('Amount on wei:');
      console.log(amountOnWei);
      const allowance = await this.connectionService.readContract(this.getTokenContractAddress(tokenToSpend), BEP20.abi, 'allowance', [userAddr, spender]);
      const pay = this.connectionService.fromWei(amountOnWei);
      const allowed = this.connectionService.fromWei(allowance);
      console.log(parseFloat(pay));
      console.log(parseFloat(allowed));
      if (parseFloat(pay) > parseFloat(allowed)) {
        console.log('not allowed!');
        return false;
      } else {
        console.log('allowed!');
        return true;
      }
    } catch (error: any) {
      console.log(error);
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Makes the approvement of the spender
   * @param spender : the contrat is going to spend tokens
   * @param userAddr : user address
   * @param tokenToSpend : token is goint to be spent
   * @returns : true if is approved
   */
  async tokenApprove(spender: string, tokenToSpend: number | string, amount?: string): Promise<any> {
    console.log('token: ', tokenToSpend);
    console.log('spender:', spender);
    let dialogRef = this.dialogService.openRegularInfoDialog('actionNeeded', 'approveContractInteraction', 'allowance');
    let isApproved = false;
    try {
      let stringAmount = MaxUint256.toString();
      if (amount) { stringAmount = amount; }
      const contractAddress = this.getTokenContractAddress(tokenToSpend);
      const tx = await this.connectionService.writeContract(contractAddress, BEP20.abi, 'approve', [spender, stringAmount]);
      dialogRef.close();
      dialogRef = this.dialogService.openRegularInfoDialog('allowance', 'waitTransaction', '');
      await waitForTransaction({hash: tx.hash});
      dialogRef.close();
      isApproved = true;
    } catch (error: any) {
      dialogRef.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
    return isApproved;
  }

  /**
   * Manage the approvement of an ERC721 token, check and if not done, do the approvement
   * @param spender : the contrat is going to spend tokens
   * @param tokenAddress : token is goint to be spent
   * @returns : true if is approved
   */
  async nftCheckAllowance(spender: string, tokenAddress: any): Promise<boolean> {
    console.log(tokenAddress);
    const userAddr = this.connectionService.getWalletAddress();
    let allowance = false;
    await this.connectionService.readContract(tokenAddress, ERC721.abi, 'isApprovedForAll', [userAddr, spender]).then( async (res: any) => {
      console.log('nft Allowance');
      console.log(res);
      if (res === false) {
        allowance = await this.nftAllowSpender(spender, tokenAddress);
      } else {
        allowance = true;
      }
    });
    return allowance;
  }

  /**
   * Makes an approvement for all of the spender
   * @param spender : the contrat is going to spend tokens
   * @param contract : contract of the ERC721 token
   * @returns
   */
  async nftAllowSpender(spender: string, tokenAddress: any): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'approveContractInteraction', '');
    let allowance = false;
    try {
      const tx = await this.connectionService.writeContract(tokenAddress, ERC721.abi, 'setApprovalForAll', [spender, true]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('allowance', 'waitTransaction', '');
      await waitForTransaction(tx);
      dialog.close();
      allowance = true;
    } catch (error: any) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
      allowance = false;
    }
    return allowance;
  }

  /**
   * Get ERC20 token contract by given token on number or string
   * @param token : token to get its contract
   * @returns : token contract
   */
  getTokenContractAddress(token: number | string): any {
    switch (token) {
      case 0:
        return contractAddresses.busd;
      case 1:
        return contractAddresses.sck;
      case 'GQ':
        return contractAddresses.gq;
      case 'BUSD':
        return contractAddresses.busd;
      case 'BNB':
        return contractAddresses.bnb;
      case 'ORVP':
        return contractAddresses.vp;
      default:
        return token;
    }
  }

  /**
   * Gets coin addres by ticker
   * @param ticker : ticker of the token
   * @returns : the token address
   */
  async getCoinAddressByTicker(ticker: string): Promise<string> {
    switch (ticker.toUpperCase()) {
      case 'GQ':
        return contractAddresses.gq;
      case 'BUSD':
        return contractAddresses.busd;
      case 'BNB':
        return contractAddresses.bnb;
      default:
        return '';
    }
  }

  /**
   * Gets coin ticker by addres
   * @param address : the token address
   * @returns : ticker of the token
   */
  async getCoinTickerByAddress(address: string): Promise<string> {
    switch (address.toLowerCase()) {
      case contractAddresses.gq.toLowerCase():
        return 'GQ';
      case contractAddresses.busd.toLowerCase():
        return 'BUSD';
      case contractAddresses.bnb.toLowerCase():
        return 'BNB';
      default:
        return '';
    }
  }

  async getDetailedData(address:string): Promise<any>{
    const data = await this.connectionService.getReadContract(BEP20.abi, address);
    console.log(data);
    return data;
  }

}
