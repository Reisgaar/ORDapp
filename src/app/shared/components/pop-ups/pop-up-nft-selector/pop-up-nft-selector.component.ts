import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { getWalletNfts } from 'src/app/constants/gqlQueries';
import { UtilsService } from '../../../services/utils.service';

interface popUpNftSelectorData {
  nftContractAddress: string;
  userAddress: string;
  showTierRarityFilter: boolean;
  isClanShip?: boolean;
  armorFilter?: string;
}

@Component({
  selector: 'app-pop-up-nft-selector',
  templateUrl: './pop-up-nft-selector.component.html',
  styleUrls: ['./pop-up-nft-selector.component.scss']
})
export class PopUpNftSelectorComponent implements OnInit, OnDestroy {
  nftsLoaded: boolean = false;
  nftList: any[] = [];
  walletQuery: any;
  walletQuerySubscription: any;
  armorFilterExist: boolean = false;
  selectedTier: string = "all";
  selectedRarity: number = -1;
  filteredItemsExist: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<PopUpNftSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: popUpNftSelectorData,
    private apollo: Apollo,
    private utilsService: UtilsService
  ) { }

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getWalletNft();
  }

  /**
   * Unsubscribe query
   */
  ngOnDestroy(): void {
    if (this.walletQuerySubscription) { this.walletQuerySubscription.unsubscribe(); }
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  selectNft(tokenId: number): void {
    this.dialogRef.close(tokenId);
  }

  /**
   * Gets user's NFTs on wallet subscribing to query
   */
  async getWalletNft(): Promise<any> {
    if (this.walletQuerySubscription) { this.walletQuerySubscription.unsubscribe(); }
    this.walletQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletNfts,
      pollInterval: 3000,
      variables: {
        wallet: this.data.userAddress.toLowerCase(),
        armors: this.data.nftContractAddress.toLowerCase() === contractAddresses.armor.toLowerCase() ? 'Armor' : 'not queried',
        clanBadges: this.data.nftContractAddress.toLowerCase() === contractAddresses.clanBadge.toLowerCase() ? 'ClanBadge' : 'not queried',
        exocredits: this.data.nftContractAddress.toLowerCase() === contractAddresses.exocredit.toLowerCase() ? 'Exocredit' : 'not queried',
        cosmetics: this.data.nftContractAddress.toLowerCase() === contractAddresses.cosmetic.toLowerCase() ? 'Cosmetic' : 'not queried',
        landVehicles: this.data.nftContractAddress.toLowerCase() === contractAddresses.landVehicle.toLowerCase() ? 'LandVehicle' : 'not queried',
        spaceVehicles: this.data.nftContractAddress.toLowerCase() === contractAddresses.spaceVehicle.toLowerCase() ? 'LandVehicle' : 'not queried',
        weapons: this.data.nftContractAddress.toLowerCase() === contractAddresses.weapon.toLowerCase() ? 'Weapon' : 'not queried',
        lands: this.data.nftContractAddress.toLowerCase() === contractAddresses.land.toLowerCase() ? 'Land' : 'not queried',
        keys: this.data.nftContractAddress.toLowerCase() === contractAddresses.holdtelKey.toLowerCase() ? 'Key' : 'not queried'
      }
    });
    this.walletQuerySubscription = this.walletQuery
      .valueChanges
      .subscribe( async (res: any) => {
        await this.setNftArray(res.data.inventory[0]);
        this.nftsLoaded = true;
      });
  }

  /**
   * Process the NFT array
   * @param queryData data from query
   */
  async setNftArray(queryData: any): Promise<any> {
    this.nftList = [];
    let auxArray = [];
    for (let i in queryData) {
      if (queryData[i].length > 0 && typeof queryData[i] === 'object') {
        auxArray = auxArray.concat(queryData[i]);
      }
    }
    this.nftList = await this.utilsService.parseMetadata(auxArray);
    if (this.data.nftContractAddress.toLowerCase() === contractAddresses.spaceVehicle.toLowerCase()) {
      this.filterSpaceVehicles();
    }
    if (this.data.armorFilter) {
      this.nftList = this.nftList.filter( nft => nft.name.toLowerCase() === this.data.armorFilter.toLowerCase())
    }
    console.log(this.nftList);
  }

  /**
   * Filter if it is space or clan vehicle (both has same nft address)
   */
  filterSpaceVehicles(): void {
    if (this.data.isClanShip === true) {
      this.nftList = this.nftList.filter( nft => nft.typeId === 1 );
    } else {
      this.nftList = this.nftList.filter( nft => nft.typeId === 0 );
    }
  }

  /**
   * Set the selected rarity
   * @param newRarity rarity to set
   */
  setSelectedRarity(newRarity: number): void {
    this.selectedRarity = newRarity === this.selectedRarity ? -1 : newRarity;
    this.checkIfFilteredItemsExist();
  }
  
  /**
   * Set the selected Tier
   * @param newTier Tier to set
   */
  setSelectedTier(newTier: string): void {
    this.selectedTier = newTier === this.selectedTier ? 'all' : newTier;
    this.checkIfFilteredItemsExist();
  }
  
  /**
   * Checks if any item exists with selected filters
   */
  checkIfFilteredItemsExist(): void {
    const tierIsSelected = this.selectedTier === 'all' ? false : true;
    const rarityIsSelected = this.selectedRarity === -1 ? false : true;
    const filteredTierExist = this.nftList.findIndex( nft => nft.tier.toLowerCase() === this.selectedTier.toLowerCase()) === -1 ? false : true;
    const filteredRarityExist = this.nftList.findIndex( nft => nft.rarityId === this.selectedRarity ) === -1 ? false : true;
    const filteredBothExist = this.nftList.findIndex( nft => nft.tier.toLowerCase() === this.selectedTier.toLowerCase() && nft.rarityId === this.selectedRarity ) === -1 ? false : true;
    this.filteredItemsExist = 
      !tierIsSelected && !rarityIsSelected ? true
      : tierIsSelected && !rarityIsSelected ? filteredTierExist
      : rarityIsSelected && !tierIsSelected ? filteredRarityExist
      : filteredBothExist;
    console.log('filteredItemsExist:', this.filteredItemsExist);
  }

}
