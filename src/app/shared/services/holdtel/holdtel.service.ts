import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { holdtelAddresses } from 'src/app/constants/holdtelAddresses';
import MerkleTree from 'merkletreejs';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
import { ethers } from 'ethers';
// Abi
import { default as HoldtelClaim } from'src/app/shared/contracts/holdtel/HoldtelClaim.json' ;

@Injectable({
  providedIn: 'root'
})
export class HoldtelService {
  addresses: string[];
  size: string;
  merkleTree: any;
  rootHash: any;
  isOnList: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService
  ) {}

  /**
   * Get de data for claiming Holdtel Key of given address
   * @param address the address to look for
   * @returns claim data
   */
  async getHoldtelClaimData(address: string): Promise<any> {
    await this.createMerkelTree(address);
    const claimData = { isInWhitelist: false, keyClaimed: false, size: null, merkleProof: null };
    if (this.isOnList) {
      const hashedAddress = ethers.utils.keccak256(address);
      const proof = this.merkleTree.getHexProof(hashedAddress);
      const isWhiteListed = await this.connectionService.readContract(contractAddresses.holdtelClaim, HoldtelClaim.abi, 'isInWhiteList', [proof, this.size, address]);
      const keyClaimed = await this.connectionService.readContract(contractAddresses.holdtelClaim, HoldtelClaim.abi, 'claimedKeysMap', [this.size, address]);
      if (isWhiteListed) {
        claimData.isInWhitelist = true;
        claimData.keyClaimed = keyClaimed;
        claimData.size = this.size;
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
    for (let [key, value] of Object.entries(holdtelAddresses)) {
      if (value.map(item => item.toLowerCase()).includes(address.toLowerCase())) {
        this.addresses = value;
        this.size = key;
        return true;
      }
    }
    return false;
  }

  /**
   * Claims a key on the claim holdtel Smart Contract
   * @param size size of the key to claim
   * @param merkleProof the merkle proof of the address
   * @returns the transaction of the SC
   */
  async claimKey(size: string, merkleProof: string[]): Promise<any> {
    let dialog = this.dialogService.openRegularInfoDialog('claimHoldtelKey', 'confirmHoldtelClaimTransaction', '');
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.holdtelClaim, HoldtelClaim.abi, 'claimORGoldStarKey', [size, merkleProof]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('claimHoldtelKey', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('claimHoldtelKey', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return res;
    } catch (error: any) {
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }
}
