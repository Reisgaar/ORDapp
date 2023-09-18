import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PartnerApiService } from '../partner-api.service';
import { ConnectionService } from '../connection/connection.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';

/**
 * Service to manage all functions related to the partner NFTs
 */
@Injectable({
  providedIn: 'root'
})
export class PartnerNftService {
  armor: any;
  clan: any;
  cosmetic: any;
  exocredit: any;
  landVehicle: any;
  spaceVehicle: any;
  weapon: any;
  private _txHash = new BehaviorSubject<string>('');
  txHash = this._txHash.asObservable();

  constructor(
    private connectionService: ConnectionService,
    private partnerApiService: PartnerApiService
  ) { }

  /**
   * Gets one NFT metadata
   * @param tokenId : the id of the NFT
   * @param nftContractAddress : the address of the NFT smart contract
   * @returns : the metadata of the NFT
   */
  async getOneNftData(tokenId: any, nftContractAddress: string): Promise<any> {
    console.log(tokenId);
    console.log(nftContractAddress);
    const tokenMetadataURI = await this.connectionService.readContract(nftContractAddress, ERC721.abi, 'tokenURI', [tokenId]);
    const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json());
    const owner = await this.connectionService.readContract(nftContractAddress, ERC721.abi, 'ownerOf', [tokenId]);
    tokenMetadata.owner = owner;
    tokenMetadata.id = tokenId;
    tokenMetadata.nftContractAddress = nftContractAddress;
    return tokenMetadata;
  }

  /**
   * Redeems a MVP Pack NFT
   * @param nftContractAddress : the address of the NFT smart contract
   * @param tokenId : the id of the NFT
   * @returns : the result of the redeem method
   */
  async redeemNft(nftContractAddress: string, tokenId: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    console.log(nftContractAddress);
    try {
      const tx = await this.connectionService.writeContract(nftContractAddress, ERC721.abi, 'redeem', [tokenId]);
      // TODO: Check this after wagmi write method use update, tx.hash may fail
      console.log(tx);
      this._txHash.next(tx.hash);
      const updateData = {
        hash: tx.hash,
        wallet: userAddr,
        tokenId: parseInt(tokenId, 0),
        tokenAddress: nftContractAddress
      };
      this.partnerApiService.updateUserData(updateData).subscribe(
        res => { console.log(res); },
        error => { console.log(error); }
      );
      return await waitForTransaction(tx);
    } catch (error: any) {
      return {type: 'error', message: error.message};
    }
  }

  /**
   * Signature to security on redemption
   * @returns : signed data
   */
  async signature(): Promise<any> {
    try {
      // Sign
      const signedData = await this.connectionService.signData('Signature required to redeem NFT.');
      return signedData;
    } catch (error: any) {
      throw error;
    }
  }
}
