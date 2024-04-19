import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { signTypedData, waitForTransaction } from '@wagmi/core';
import { BridgeApiService } from './bridge-api.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { TokenService } from '../token/token.service';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
// Abi
import { default as BridgeERC20Redeemer } from 'src/app/shared/contracts/bridge/BridgeERC20Redeemer.json';
import { default as BridgeERC20Claimer } from 'src/app/shared/contracts/bridge/BridgeERC20Claimer.json';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private bridgeApiService: BridgeApiService,
    private tokenService: TokenService
  ) { }

  /**
   * Start the process to send tokens to the game
   * @param receiver the wallet to receive the tokens
   * @param tokenAddress the token to send
   * @param tokenTicker ticker of the token
   * @param tokenAmount amount to send
   * @returns
   */
  async sendTokenToGame(receiver: string, tokenAddress: string, tokenTicker: string, tokenAmount: string): Promise<any> {
    // Just fix for testnet
    if (environment.network === 'testnet') {
      tokenAddress = contractAddresses.gqBridge;
    }
    //
    console.log('Sending', tokenAmount, ' ', tokenTicker, '(', tokenAddress, ') to BG');
    // The price has to be on WEI
    const tokenAmountWei = this.connectionService.toWei(tokenAmount);
    // Get the connected wallet address
    const userAddr = this.connectionService.getWalletAddress();
    // Check the token approvement
    const isApproved = await this.tokenService.tokenApprovement(contractAddresses.bridgeERC20Redeemer, userAddr, tokenAddress, tokenAmountWei);
    if (isApproved) {
      // Dialogs to inform about the process to the user
      let dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'checkingBlinkUser', '');
      try {
        // Check if user is on BG DB
        const isOnDb = await this.checkIfUserIsOnDb(receiver);
        console.log(isOnDb);
        if (isOnDb) {
          // Redeem tokens
          return await this.redeemTokens(receiver, dialog, tokenAddress, tokenTicker, tokenAmount, tokenAmountWei);
        } else {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'userNotInDb', '', 'createBlinkAccount_html');
        }
      } catch (error) {
        dialog.close();
        console.log(error);
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    } else { }
  }

  /**
   * Check if given wallet is on Blink Galaxy database
   * @param userAddr wallet address
   * @returns boolean, true if is on DB
   */
  async checkIfUserIsOnDb(userAddr: string): Promise<boolean> {
    try {
      const res = await this.bridgeApiService.walletIsValid(userAddr);
      console.log('Wallet on Blink Galaxy database:', res.isValid);
      return res.isValid;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tokens from Blink Galaxy
   * @param receiver the wallet to receive the tokens
   * @param dialog dialog to manage popUps
   * @param tokenAddress the token to receive
   * @param tokenTicker ticker of the token
   * @param tokenAmount amount to receive
   * @param tokenAmountWei amount to receive on wei
   * @returns
   */
  async redeemTokens(receiver: string, dialog: any, tokenAddress: string, tokenTicker: string, tokenAmount: string, tokenAmountWei: string): Promise<any> {
    // Just fix for testnet
    if (environment.network === 'testnet') {
      tokenAddress = contractAddresses.gqBridge;
    }
    //
    try {
      const deadline = Math.ceil(Date.now() / 1000) + 600;
      // Get the user signature
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'signTx', '');
      const signature = await this.sign(receiver, tokenAddress, tokenAmountWei, deadline);
      console.log(signature);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'transferTokens', tokenAmount + ' ' + tokenTicker);
      // Get fee and redeem tokens
      const fee = await this.connectionService.readContract(contractAddresses.bridgeERC20Redeemer, BridgeERC20Redeemer.abi, 'getOperationFeeInBNB' , []);
      // Redeem tokens on contract
      const tx = await this.connectionService.writeContract(contractAddresses.bridgeERC20Redeemer, BridgeERC20Redeemer.abi, 'redeemTokens' , [tokenAddress, receiver, tokenAmountWei, deadline, signature.v, signature.r, signature.s], fee);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeToBlink', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Sign Typed data
   * @param receiver the wallet is sending tokens
   * @param tokenAddress the address of the token
   * @param amountToRedeem the amount to redeem
   * @param deadline
   * @returns
   */
  async sign(receiver: string, tokenAddress: string, amountToRedeem: string, deadline: any): Promise<any> {// Just fix for testnet
    if (environment.network === 'testnet') {
      tokenAddress = contractAddresses.gqBridge;
    }
    //
    // Set the domain
    const domain = {
      name: 'Blockchain Bridge',
      version: '1',
      chainId: environment.chainId,
      verifyingContract: contractAddresses.bridgeERC20Redeemer,
    };
    // The named list of all type definitions
    const types = {
      RedeemTokens: [
        { name: 'tokenAddress', type: 'address' },
        { name: 'receiver', type: 'address' },
        { name: 'amountToRedeem', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ],
    };
    // Get connected wallet address
    const userAddr = this.connectionService.getWalletAddress();
    // Get the nonce for the transaction
    const nonce = await this.connectionService.readContract(contractAddresses.bridgeERC20Redeemer, BridgeERC20Redeemer.abi, 'redemptionNonces' , [userAddr]);
    // Prepare the message
    const message = {
      tokenAddress,
      receiver,
      amountToRedeem,
      deadline,
      nonce: nonce
    };
    // Sign with eth_signTypedData-v4
    const config: any = { domain, message, primaryType: 'RedeemTokens', types };
    const signature = await signTypedData(config);
    // Return splitted signaute s v r
    return ethers.utils.splitSignature(signature);
  }

  /**
   * Get data if user has tokens to redeem
   * @returns amount of tokens to redeem
   */
  async getTokensToRedeem(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.bridgeERC20Claimer, BridgeERC20Claimer.abi, 'userTokenAmounts', [userAddr]);
  }

  /**
   * Claims the selected amount of tokens
   * @param amount amount to claim
   */
  async claimTokens(amount: string): Promise<any> {
    console.log(amount);
    // Dialogs to inform about the process to the user
    let dialog = this.dialogService.openRegularInfoDialog('bridgeFromBlink', 'claimTokens', '');
    try {
      // Get the fee of the transaction
      const fee = await this.connectionService.readContract(contractAddresses.bridgeERC20Redeemer, BridgeERC20Redeemer.abi, 'getOperationFeeInBNB' , []);
      // Claim the tokens
      const tx = await this.connectionService.writeContract(contractAddresses.bridgeERC20Claimer, BridgeERC20Claimer.abi, 'claimTokens', [amount], fee);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeFromBlink', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('bridgeFromBlink', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
    } catch (error) {
      dialog.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }
}
