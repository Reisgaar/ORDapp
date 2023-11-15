import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getWalletArmorAndWeaponsquery } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { FoundryService } from '../../../shared/services/foundry/foundry.service';

@Component({
  selector: 'app-crafting-foundry',
  templateUrl: './crafting-foundry.component.html',
  styleUrls: ['./crafting-foundry.component.scss']
})
export class CraftingFoundryComponent implements OnInit, OnDestroy {
  selectedTab: string = 'weapon';
  weaponSelectionIsOpen: boolean = false;
  armorSelectionIsOpen: boolean = false;
  walletIsConnected: boolean = false;
  querySubscription: any;
  nftsQuery: any;
  userWeapons: any[] = [];
  userArmors: any[] = [];
  selectedNfts: any[] = [];
  selectedNftsId: any[] = [];
  burneableNFTMaxAmount: number = 1;
  tierToShow: string = 'Tier1';
  poolAvailableStatus: any;
  poolUpgradeStatus: any = [false, false, false, false, false];
  nftListLoaded: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private utilsService: UtilsService,
    private foundryService: FoundryService,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getWalletNfts(userAddress);
      } else {
        if (this.querySubscription) { this.querySubscription.unsubscribe(); }
      }
    });
  }

  /**
   * Ends intervals if exist
   */
  ngOnDestroy(): void {
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Changes the selected tab
   * @param newTab change selected tab to given one
   */
  changeSelectedTab(newTab: string): void {
    if (this.selectedTab !== newTab) {
      this.cleanSelectedNFTs();
    }
    this.weaponSelectionIsOpen = false;
    this.armorSelectionIsOpen = false;
    this.selectedTab = newTab;
  }

  /**
   * Sets the tier to show on selection
   * @param newTier tier to show
   */
  setTierToShow(newTier: string): void {
    this.tierToShow = newTier;
  }

  /**
   * Open the weapon selection menu
   */
  openWeaponSelection(): void {
    this.weaponSelectionIsOpen = true;
    this.selectedTab = 'weapon';
  }

  /**
   * Open the armor selection menu
   */
  openArmorSelection(): void {
    this.armorSelectionIsOpen = true;
    this.selectedTab = 'armor';
  }

  /**
   * Close the weapon selection menu
   */
  closeWeaponSelection(): void {
    this.weaponSelectionIsOpen = false;
    this.cleanSelectedNFTs();
  }

  /**
   * Close the armor selection menu
   */
  closeArmorSelection(): void {
    this.armorSelectionIsOpen = false;
    this.cleanSelectedNFTs();
  }

  /**
   * Erases the user NFT selection
   */
  cleanSelectedNFTs(): void {
    this.selectedNfts = [];
    this.selectedNftsId = [];
  }

  /**
   * Get wallet owned NFTs
   * @param userAddress addres of the user
   */
  async getWalletNfts(userAddress: string): Promise<any> {
    this.nftsQuery = this.apollo.use('marketplace').watchQuery({
      query: getWalletArmorAndWeaponsquery,
      pollInterval: 5000,
      variables: {
        wallet: userAddress
      }
    });
    this.querySubscription = this.nftsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log('User NFTs Query:');
        console.log(res)
        await this.processNftData(res.data.inventory[0].weapons, res.data.inventory[0].armors);
        console.log(this.userArmors);
        console.log(this.userWeapons);
        this.nftListLoaded = true;
    });
  }

  /**
   * Process data from Graph query
   * @param frozenWeapons : frozen weapon NFT data from graph
   * @param frozenArmors  : frozen armor NFT data from graph
   */
  async processNftData(frozenWeapons: any[], frozenArmors: any[]): Promise<any> {
    let armors = JSON.parse( JSON.stringify( frozenArmors ) );
    let weapons = JSON.parse( JSON.stringify( frozenWeapons ) );
    armors = armors.map( item => { return { ...item, tokenId: parseInt(item.id, 16) } });
    weapons = weapons.map( item => { return { ...item, tokenId: parseInt(item.id, 16) } });
    this.userArmors = await this.utilsService.parseMetadata(armors);
    this.userWeapons = await this.utilsService.parseMetadata(weapons);
    this.userArmors.sort(this.sortByRarity);
    this.userWeapons.sort(this.sortByRarity);
  }

  /**
   * Function for Array.sort() param: sorts the items by rarity
   * @returns sorted array
   */
  sortByRarity(a: any, b: any ) {
    const rar = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    if ( rar.indexOf(a.rarity.toLowerCase()) < rar.indexOf(b.rarity.toLowerCase()) ){ return -1; }
    if ( rar.indexOf(a.rarity.toLowerCase()) > rar.indexOf(b.rarity.toLowerCase()) ){ return 1; }
    return 0;
  }

  /**
   * Add/remove an NFT to selectedNFT array
   * @param nft NFT to add/remove
   */
  addToSelectedNfts(nft: any): void {
    const index = this.selectedNfts.findIndex( item => item.tokenId === nft.tokenId);
    if (index > -1) {
      this.selectedNfts.splice(index, 1);
      this.selectedNftsId.splice(index, 1);
    } else if (this.selectedNfts.length < this.burneableNFTMaxAmount) {
      this.selectedNfts.push(nft);
      this.selectedNftsId.push(nft.tokenId);
    }
    console.log(this.selectedNftsId)
  }

  /**
   * Opens detail of the NFT on click
   */
  async clickToDetail(nft: any): Promise<void> {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: nft.nftContractAddress, id: nft.tokenId}})
    );
    window.open(url, '_blank');
  }

  /**
   * Send the selected NFTs to foundry pool
   */
  async sendNFTsToPool(): Promise<any> {
    // type: 0 is for armor, 1 is for weapon
    const type = this.armorSelectionIsOpen ? 0 : this.weaponSelectionIsOpen ? 1 : null;
    const nftsToBurn = this.selectedNfts.map( nft => nft.tokenId);
    await this.foundryService.sendToFoundryPool(type, nftsToBurn).then( res => {
      if (res) {
        this.armorSelectionIsOpen = false;
        this.weaponSelectionIsOpen = false;
        this.cleanSelectedNFTs();
      }
    });
  }

  /**
   * Receives from child if pool is full available
   * @param event
   */
  receiveFullAvailabilityData(event: any): void {
    this.poolUpgradeStatus[event.pool] = event.isUpgraded;
    this.burneableNFTMaxAmount = this.poolUpgradeStatus.includes(true) ? 3 : 1;
    if (this.burneableNFTMaxAmount === 1) {
      this.selectedNfts = this.selectedNfts[0] ? [this.selectedNfts[0]] : [];
      this.selectedNftsId = this.selectedNftsId[0] ? [this.selectedNftsId[0]] : [];
    }
  }

}
