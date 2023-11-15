import { Injectable } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
// ABI
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';
import { default as CraftingCreation } from 'src/app/shared/contracts/crafting/CraftingCreation.json';
import { default as CraftingStyling } from 'src/app/shared/contracts/crafting/CraftingStyling.json';
import { default as CraftingAssembly } from 'src/app/shared/contracts/crafting/CraftingAssembly.json';
import { default as CraftingSharedStorage } from 'src/app/shared/contracts/crafting/CraftingSharedStorage.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CraftingUtilsService {
  private _userCraftedAmounts = new BehaviorSubject<any>({});
  userCraftedAmounts = this._userCraftedAmounts.asObservable();

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService
  ) {}


  /**
   * Sets data of creation step requirements
   */
  async setUserCraftedAmount(userAddr: string): Promise<any> {
    let userCraftedT1Items = await this.connectionService.readContract(contractAddresses.craftingCreation, CraftingCreation.abi, 'userCraftedItemsByTier', [1, userAddr]);
    let userCraftedT2Items = await this.connectionService.readContract(contractAddresses.craftingCreation, CraftingCreation.abi, 'userCraftedItemsByTier', [2, userAddr]);
    userCraftedT1Items = typeof userCraftedT1Items !== 'number' ? parseInt(userCraftedT1Items) : userCraftedT1Items;
    userCraftedT2Items = typeof userCraftedT2Items !== 'number' ? parseInt(userCraftedT2Items) : userCraftedT2Items;
    this._userCraftedAmounts.next({tier1: userCraftedT1Items, tier2: userCraftedT2Items});
  }

  /**
   * Gets data of creation step requirements
   * @returns object with requirements
   */
  getUserCraftedAmount(): any {
    return this._userCraftedAmounts;
  }


  /**
   * Get price of the crafting start fee pool
   * @returns fee price
   */
  async getCraftingFeeInUSD(): Promise<any> {
    let price = await this.connectionService.readContract(contractAddresses.craftingSharedStorage, CraftingSharedStorage.abi, 'craftingFee', []);
    if (price !== '0') { price = this.connectionService.fromWei(price); }
    return price.toString();
  }

  /**
   * Get de data of the selected step and pool
   * @param step the number of the step
   * @param pool the number of the pool
   * @returns the pool data
   */
  async getPoolData(step: number, pool: number): Promise<any> {
    if (step === 1) {
      return await this.getFirstStepPoolData(pool);
    } else if (step === 2) {
      return await this.getSecondStepPoolData(pool);
    } else if (step === 3) {
      return await this.getThirdStepPoolData(pool);
    }
  }

  /**
   * Get the data of the first step
   * @param pool the number of the pool
   * @returns the pool data
   */
  async getFirstStepPoolData(pool: number): Promise<any> {
    const tier = pool + 1;
    const userAddr = this.connectionService.getWalletAddress();
    let item = await this.connectionService.readContract(contractAddresses.craftingCreation, CraftingCreation.abi, 'userCreationItems', [userAddr, pool]);
    let poolGameStatus = await this.connectionService.readContract(contractAddresses.craftingCreation, CraftingCreation.abi, 'checkTierStatusByUser', [tier, userAddr]);
    let requiredCrafts = await this.connectionService.readContract(contractAddresses.craftingCreation, CraftingCreation.abi, 'requiredCraftedItemsByTier', [tier]);
    requiredCrafts = typeof requiredCrafts !== 'number' ? parseInt(requiredCrafts) : requiredCrafts;
    if (pool === 1) { this.setUserCraftedAmount(userAddr); }
    if (item.exists) {
      const idData = await this.getCraftingIdData(item.craftingId);
      item = {
        ...item,
        ...idData
      }
    }
    return {
      ...item,
      isLocked: !poolGameStatus,
      requiredCrafts
    };
  }

  /**
   * Get the data of the second step
   * @param pool the number of the pool
   * @returns the pool data
   */
  async getSecondStepPoolData(pool: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let item = await this.connectionService.readContract(contractAddresses.craftingStyling, CraftingStyling.abi, 'userStylingItems', [userAddr, pool]);
    if (item.exists) {
      const idData = await this.getCraftingIdData(item.craftingId);
      const partData = await this.getCraftingIdPartData(item.craftingId);
      item = {
        ...item,
        ...idData,
        parts: partData
      }
    }
    return item;
  }

  /**
   * Get the data of the third step
   * @param pool the number of the pool
   * @returns the pool data
   */
  async getThirdStepPoolData(pool: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let item = await this.connectionService.readContract(contractAddresses.craftingAssembly, CraftingAssembly.abi, 'userAssemblyItems', [userAddr, pool]);
    if (item.exists) {
      const idData = await this.getCraftingIdData(item.craftingId);
      const partData = await this.getCraftingIdPartData(item.craftingId);
      item = {
        ...item,
        ...idData,
        parts: partData
      }
    }
    return item;
  }

  /**
   * Get the data of the crafting id item
   * @param craftingId the id of the crafting item
   * @returns the item data
   */
  async getCraftingIdData(craftingId: any): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.craftingSharedStorage, CraftingSharedStorage.abi, 'craftingItems', [craftingId]);
  }

  /**
   * Get the parts (aesthetics) data of the crafting id item
   * @param craftingId the id of the crafting item
   * @returns the item parts (aesthetics) data
   */
  async getCraftingIdPartData(craftingId: any): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.craftingSharedStorage, CraftingSharedStorage.abi, 'getCraftingItemAesthetics', [craftingId]);
  }

  /**
   * Gets the id of a weapon part
   * @param value name of the weapon part
   * @returns the weapon part id
   */
  async getWeaponPartIdByName(value: string): Promise<number> {
    switch (value.toLowerCase()) {
      case 'hilt': return 0;
      case 'crossguard': return 1;
      case 'blade': return 2;
      case 'head': return 3;
      case 'grip': return 4;
      case 'barrel': return 5;
      case 'body': return 6;
      case 'magazine': return 7;
      case 'reflexsight': return 8;
      case 'holographicsight': return 9;
      case 'laserpointer': return 10;
      case 'silencer': return 11;
      case 'stock': return 12;
      case 'x4sight': return 13;
      case 'bayonetta': return 14;
      case 'striker': return 15;
      case 'bipod': return 16;
      case 'grenadelauncher': return 17;
      case 'attachedshotgun': return 18;
      case 'snipersight': return 19;
      case 'barrelbrake': return 20;
    }
  }

  /**
   * Gets the id of a weapon
   * @param value name of the weapon
   * @returns the weapon id
   */
  async getWeaponIdByName(value: string): Promise<number> {
    switch (value.toLowerCase()) {
      case 'knife': return 0;
      case 'blade': return 1;
      case 'blunt': return 2;
      case 'pistol': return 3;
      case 'revolver': return 4;
      case 'shotgun': return 5;
      case 'repeatershotgun': return 6;
      case 'assaultsmg': return 7;
      case 'highratesmg': return 8;
      case 'lightmachinegun': return 9;
      case 'assaultrifle': return 10;
      case 'sniperrifle': return 11;
      case 'precisionrifle': return 12;
    }
  }

  /**
   * Get an element Id by it's letter
   * @param letter the letter of the element
   * @returns the Id of the element
   */
  async getElementIdByLetter(letter: string): Promise<number> {
    switch (letter.toLowerCase()) {
      case 'b': return 0;
      case 'l': return 1;
      case 'm': return 2;
      case 'p': return 3;
    }
  }

  /**
   * Gets the id of a rarity
   * @param value name of the rarity
   * @returns the rarity id
   */
  async getRarityIdByName(name: string): Promise<number> {
    switch (name.toLowerCase()) {
      case 'common': return 0;
      case 'uncommon': return 1;
      case 'rare': return 2;
      case 'epic': return 3;
      case 'legendary': return 4;
    }
  }

  /**
   * Gets the id of an armor piece
   * @param value name of the armor
   * @returns the armor id
   */
  async getArmourIdByName(value: string): Promise<number> {
    switch (value.toLowerCase()) {
      case 'helmet': return 0;
      case 'chest': return 1;
      case 'shoulders': return 2;
      case 'forearms': return 3;
      case 'arms': return 4;
      case 'gloves': return 5;
      case 'legs': return 6;
      case 'kneepads': return 7;
      case 'boots': return 8;
    }
  }

  /**
   * Checks the allowance for a list of tokens
   * @param tokens the array of the tokens
   * @param spender spender of the tokens
   * @param userAddr the wallet of the user
   * @returns true if all materials are allowed
   */
  async checkAllowanceOfRequiredMaterials(tokens: any, spender: string, userAddr: string): Promise<boolean> {
    let allTokensAllowed = true;
    // tslint:disable-next-line: forin
    for (const token in tokens) {
      const tokenAmount = this.connectionService.toWei(tokens[token].toString());
      const tokenToSpend = contractAddresses[token.toLowerCase()];
      const thisTokenIsApproved = await this.tokenService.tokenApprovement(spender, userAddr, tokenToSpend, tokenAmount);
      if (!thisTokenIsApproved) {
        allTokensAllowed = false;
        return false;
      }
    }
    return allTokensAllowed;
  }

  /**
   * Checks if crafted item URI is different to it's default URI
   * @param tokenId the id of the NFT
   * @param craftingContract the crafting contract
   * @param nftContractAddress the contract address of the NFT
   * @returns true if URI is updated
   */
  async checkIfTokenUriIsUpdated(tokenId: any, craftingContract: any, nftContractAddress: string): Promise<boolean> {
    const defaultUri = await craftingContract.defaultURI();
    const nftContract = await this.connectionService.getReadContract(ERC721.abi, nftContractAddress);
    const tokenURI = await nftContract.tokenURI(tokenId);
    if (defaultUri.toLowerCase() === tokenURI.toLowerCase()) {
      return false;
    } else {
      return true;
    }
  }

}
