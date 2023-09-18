import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { speciesNFTAddresses } from 'src/app/constants/speciesNFTAddresses';
import MerkleTree from 'merkletreejs';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
import { userSpecie } from 'src/app/constants/inventory';
import { TokenService } from '../token/token.service';
import { ethers } from 'ethers';
// Abi
import { default as SpeciesClaim } from 'src/app/shared/contracts/species/SpeciesClaimNFT.json';
import { default as Species } from 'src/app/shared/contracts/species/SpeciesNFT.json';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  addresses: string[];
  specie: string;
  merkleTree: any;
  rootHash: any;
  isOnList: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private tokenService: TokenService
  ) {}

  /**
   * Get de data for claiming Specie of given address
   * @param address the address to look for
   * @returns claim data
   */
  async getSpeciesClaimData(address: string): Promise<any> {
    await this.createMerkelTree(address);
    const claimData = { isInWhitelist: false, specieClaimed: false, specie: null, merkleProof: null };
    if (this.isOnList) {
      const hashedAddress = ethers.utils.keccak256(address);
      const proof = this.merkleTree.getHexProof(hashedAddress);
      const isWhiteListed = true; // await this.connectionService.readContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'isInWhiteList', [proof, this.specie, address]);
      const specieClaimed = await this.connectionService.readContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'claimedNFTsMap', [this.specie, address]);
      if (isWhiteListed) {
        claimData.isInWhitelist = true;
        claimData.specieClaimed = specieClaimed;
        claimData.specie = this.specie;
        claimData.merkleProof = proof;
      }
    }
    return claimData;
  }

  /**
   * Creates Merkel Tree and sets variables of the service with the given address
   * @param address the address to set data
   */
  async createMerkelTree(address: string): Promise<any> {
    this.isOnList = await this.checkAndSetAddressList(address);
    if (this.isOnList) {
      let leaves = this.addresses.map( addr => ethers.utils.keccak256(addr) );
      this.merkleTree = new MerkleTree(leaves, ethers.utils.keccak256, {sortPairs: true});
      this.rootHash = this.merkleTree.getHexRoot();
    }
  }

  /**
   * Check if address is on whitelist and saves on variables address and size
   * @param address to look for
   * @returns boolean, true is on whitelist, false is not
   */
  async checkAndSetAddressList(address: string): Promise<boolean> {
    for (let [key, value] of Object.entries(speciesNFTAddresses)) {
      if (value.map(item => item.toLowerCase()).includes(address.toLowerCase())) {
        this.addresses = value;
        this.specie = key;
        return true;
      }
    }
    return false;
  }

  /**
   * Claims a specie NFT on the claim specie Smart Contract
   * @param size specie to claim
   * @param merkleProof the merkle proof of the address
   * @returns the transaction of the SC
   */
  async claimSpecieNFT(size: string, merkleProof: string[]): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('claimSpecieNFT', 'confirmSpecieClaimTransaction', '');
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'claimNFT', [size, merkleProof]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('claimSpecieNFT', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('claimSpecieNFT', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Gets the specie of the given wallet address
   * @param address the wallet address
   * @returns the specie name
   */
  async getWalletSpecie(address: string): Promise<string> {
    if (address) {
      return await this.connectionService.readContract(contractAddresses.species, Species.abi, 'walletsSpeciesMap', [address]);
    } else {
      return 'or';
    }
  }

  /**
   * Sets the specie of the given wallet address on constant
   * @param address the wallet address
   */
  async setWalletSpecie(address: string): Promise<any> {
    let specie = '';
    if (address) {
      specie = await this.connectionService.readContract(contractAddresses.species, Species.abi, 'walletsSpeciesMap', [address]);
    }
    switch (specie.toLowerCase()) {
      case 'earthling':
      case 'earthling':
      case 'mech':
      case 'oracle':
      case 'scavengon':
      case 'vaans':
        userSpecie[0] = specie.toLowerCase();
        break;
      default:
        userSpecie[0] = 'or';
        break;
    }
  }

  async changeSpecie(specie: string): Promise<any> {
    const price = await this.connectionService.readContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'busdPriceForNFT', []);
    const busd = await this.connectionService.readContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'busd', []);
    const userAddr = this.connectionService.getWalletAddress();
    console.log(contractAddresses.speciesClaim, userAddr, busd, price);
    const isApproved = await this.tokenService.tokenApprovement(contractAddresses.speciesClaim, userAddr, busd, price);
    if (isApproved) {
      let dialog = this.dialogService.openRegularInfoDialog('changeSpecieNFT', 'confirmSpecieChangeTransaction', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.speciesClaim, SpeciesClaim.abi, 'buyNFTWithBUSD', [specie]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('changeSpecieNFT', 'waitTransaction', '');
        const res = await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('changeSpecieNFT', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        this.setWalletSpecie(userAddr);
        return res;
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  async deleteSpecie(): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('burnSpecieNFT', 'confirmSpecieBurnTransaction', '');
    try {
      const userAddr = this.connectionService.getWalletAddress();
      const tx = await this.connectionService.writeContract(contractAddresses.species, Species.abi, 'burnMyNFT', [userAddr]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('burnSpecieNFT', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('burnSpecieNFT', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      this.setWalletSpecie(userAddr);
      return res;
    } catch (error: any) {
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }
}
