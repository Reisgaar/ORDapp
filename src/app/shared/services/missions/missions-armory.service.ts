import { Injectable } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { DialogService } from '../dialog.service';
// Abi
import { default as Armory } from 'src/app/shared/contracts/missions/Armory.json';
import { waitForTransaction } from '@wagmi/core';

@Injectable({
  providedIn: 'root'
})
export class MissionsArmoryService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }
  
  /**
   * Get the equipment data of the given slot
   * @param equipmentSlot 
   * @returns 
   */
  async getUserEquipmentItems(equipmentSlot: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let equipment = await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'getUserEquipmentItems', [userAddr, equipmentSlot]);
    for (let item of equipment) {
      item.durability = parseInt(item.durability);
      item.repairEndTime = parseInt(item.repairEndTime);
      item.tokenId = parseInt(item.tokenId);
    }
    return equipment;
  }
  
  /**
   * Get the equipment data of the given slot
   * @param equipmentSlot 
   * @returns 
   */
  async getUserEquipmentInfo(equipmentSlot: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'userSoldierEquipments', [userAddr, equipmentSlot]);
  }
  
  /**
   * Gets the durability of the given NFT
   * @param nftContractAddress address of the NFT contract
   * @param tokenId id of the NFT
   * @returns durability points
   */
  async getItemDurability(nftContractAddress: string, tokenId: number): Promise<number> {
    let usedPoints = await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'durabilityPointsUsed', [nftContractAddress, tokenId]);
    let maxPoints = await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'maxDurabilityPoints', []);
    usedPoints = typeof usedPoints !== 'number' ? parseInt(usedPoints) : usedPoints;
    maxPoints = typeof maxPoints !== 'number' ? parseInt(maxPoints) : maxPoints;
    return maxPoints - usedPoints;
  }
  
  /**
   * Change the equipped items on the equipment slot
   * @param tokenIds array of token ids
   * @param equipmentSlot equipment slot to change
   */
  async editEquipment(tokenIds: number[], equipmentSlot: number): Promise<any> {
    console.log('editing equipment');
    console.log(tokenIds)
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const armorsAllowed = await this.tokenService.nftCheckAllowance(contractAddresses.armory, contractAddresses.armor);
      if (armorsAllowed === false) { return; }
      const weaponsAllowed = await this.tokenService.nftCheckAllowance(contractAddresses.armory, contractAddresses.weapon);
      if (weaponsAllowed === false) { return; }
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'armoryEquipment' + equipmentSlot + 'Change', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'editEquipment', [equipmentSlot, tokenIds]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryEquipmentChange', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryEquipmentChange', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return true;
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        return false;
      }
    }
  }
  
  /**
   * Repair the item on the slot
   * @param equipmentSlot equipment slot to repair
   * @param itemSlot item slot to repair
   */
  async repairEquipmentItem(equipmentSlot: number, itemSlot: number): Promise<any> {
    console.log('repairing equipment');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      // TODO: Add prices
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'armoryRepair' + equipmentSlot + '_' + itemSlot, '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'repairEquipmentItem', [equipmentSlot, itemSlot]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryRepairItem', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryRepairItem', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
  
  /**
   * Repair the equipment
   * @param equipmentSlot equipment slot to repair
   */
  async repairEquipment(equipmentSlot: number): Promise<any> {
    console.log('repairing item');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      // TODO: Add prices
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'armoryRepair' + equipmentSlot, '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'repairEquipment', [equipmentSlot]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryRepairEquipment', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryRepairEquipment', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Skip repairing time of the item
   * @param equipmentSlot equipment slot to repair
   * @param itemSlot item to repair
   */
  async skipEquipmentItemRepairTime(equipmentSlot: number, itemSlot: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getEquipmentItemSkipRepairTimePrice(userAddr, equipmentSlot, itemSlot);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.armory, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'repairingItemSkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'skipEquipmentItemRepairTime', [equipmentSlot, itemSlot]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('armoryRepairItem', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('armoryRepairItem', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Gets the price to skip time of the item repairment
   * @param userAddr address of the user
   * @param equipmentSlot equipment slot to accelerate
   * @param itemSlot item to accelerate
   */
  async getEquipmentItemSkipRepairTimePrice(userAddr: string, equipmentSlot: number, itemSlot: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'getEquipmentItemSkipRepairTimePrice', [userAddr, equipmentSlot, itemSlot]);
  }
  
  /**
   * Skip repairing time of the equipment
   * @param equipmentSlot equipment slot to repair
   */
  async skipEquipmentRepairTime(equipmentSlot: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getEquipmentSkipRepairTimePrice(userAddr, equipmentSlot);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.armory, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'repairingEquipmentSkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'skipEquipmentRepairTime', [equipmentSlot]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('armoryRepairEquipment', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('armoryRepairEquipment', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Gets the price to skip time of the equipment repairment
   * @param userAddr address of the user
   * @param equipmentSlot equipment slot to accelerate
   */
  async getEquipmentSkipRepairTimePrice(userAddr: string, equipmentSlot: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.armory, Armory.abi, 'getEquipmentSkipRepairTimePrice', [userAddr, equipmentSlot]);
  }
  
  /**
   * Claim the repaired item of the slot
   * @param equipmentSlot equipment slot to claim
   * @param itemSlot item slot to claim
   */
  async claimEquipmentItem(equipmentSlot: number, itemSlot: number): Promise<any> {
    console.log('claiming equipment');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      // TODO: Add prices
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'armoryClaim' + equipmentSlot + '_' + itemSlot, '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'claimEquipmentItem', [equipmentSlot, itemSlot]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryClaimItem', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryClaimItem', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
  
  /**
   * Claim the repaired equipment
   * @param equipmentSlot equipment slot to claim
   */
  async claimEquipment(equipmentSlot: number): Promise<any> {
    console.log('claiming item');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      // TODO: Add prices
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'armoryClaim' + equipmentSlot, '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.armory, Armory.abi, 'claimEquipment', [equipmentSlot]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryClaimEquipment', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('armoryClaimEquipment', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
