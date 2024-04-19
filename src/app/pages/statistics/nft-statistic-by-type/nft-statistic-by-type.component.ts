import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { getArmors, getKeys, getLandVehicles, getLands, getSpaceVehicles, getWeapons } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-nft-statistic-by-type',
  templateUrl: './nft-statistic-by-type.component.html',
  styleUrls: ['./nft-statistic-by-type.component.scss']
})
export class NftStatisticByTypeComponent implements OnInit{
  @Input() queriedNft: any;

  nftQuery: any;
  nftQuerySubscription: any;
  skip: number = 0;
  first: number = 500;
  allNFTs: any[] = [];
  allNFTsByContract: any = { all: [] };
  dataLoaded = false;

  tier: number = 1;
  rarityId: number = 0;
  rarityNames = ['Common','Uncommon','Rare','Epic','Legendary']
  total: number = 0;
  userNfts: any = {};
  landSizes: any = {nano: 0, micro: 0, standard: 0, macro: 0, mega: 0};
  keySizes: any = {junior: 0, standard: 0, executive: 0, deluxe: 0, royal: 0};
  amounts: any = {
    tier1: {common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
    tier2: {common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
    tier3: {common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
  };
  totalOwners: number = 0;
  maxOwner: number = 0;

  constructor(
    private apollo: Apollo,
    private connectionService: ConnectionService
  ) {}

  /**
   * Gets all sales
   */
  ngOnInit(): void {
    this.getData();
  }

  
  /**
   * Subscribe to query to get all the sales
   */
  async getData(): Promise<any> {
    if (this.nftQuerySubscription) { this.nftQuerySubscription.unsubscribe(); }
    const query: any = this.queriedNft === 'weapons' ? getWeapons : this.queriedNft === 'armors' ? getArmors : this.queriedNft === 'landVehicles' ? getLandVehicles : this.queriedNft === 'spaceVehicles' ? getSpaceVehicles : this.queriedNft === 'lands' ? getLands : this.queriedNft === 'keys' ? getKeys : '';
    this.nftQuery = this.apollo.use('marketplace').watchQuery({
      query,
      pollInterval: 10000,
      variables: {
        skip: this.skip,
        first: this.first,
        tier: this.tier,
        rarityName: this.rarityNames[this.rarityId]
      }
    });
    this.nftQuerySubscription = this.nftQuery
      .valueChanges
      .subscribe( async (res: any) => {
        console.log('Get', this.queriedNft,'data:');
        this.manageQueryData(res.data.nft);
      });
  }

  /**
   * Manage the data get from the query (multiple querying)
   * @param frozenData data from query
   */
  manageQueryData(frozenData: any[]): void {
    let data = JSON.parse( JSON.stringify( frozenData ) );
    console.log(data)
    if (data.length > 0) {
      console.log('T'+this.tier, this.rarityNames[this.rarityId], 'skip:', this.skip);
      this.allNFTs = this.allNFTs.concat(data);
      this.skip += this.first;
      console.log(this.allNFTs);
      this.getData();
    } else {
      if (this.queriedNft === 'lands' || this.queriedNft === 'keys' || this.queriedNft === 'landVehicles' || this.queriedNft === 'spaceVehicles') {
        console.log('All done ' + this.allNFTs.length);
        this.processSalesData();
      } else if (this.queriedNft === 'armors' || this.queriedNft === 'weapons') {
        if (this.tier === 3 && this.rarityId === 4) {
          console.log('All done ' + this.allNFTs.length);
          this.processSalesData();
        } else {
          if (this.rarityId < 4) {
            this.rarityId++;
          } else {
            this.tier++;
            this.rarityId = 0;
          }
          this.skip = 0;
          this.getData();
        }
      }
    }
  }

  /**
   * Process data
   */
  async processSalesData(): Promise<any> {
    this.total = this.allNFTs.length;
    this.allNFTs.map( nft => {
      if (this.userNfts[nft.firstOwner.toLowerCase()]) {
        this.userNfts[nft.firstOwner.toLowerCase()]++;
        this.maxOwner = this.userNfts[nft.firstOwner.toLowerCase()] > this.maxOwner ? this.userNfts[nft.firstOwner.toLowerCase()] : this.maxOwner;
      } else {
        this.userNfts[nft.firstOwner.toLowerCase()] = 1;
        this.totalOwners++;
      }
      if (this.queriedNft === 'armors' || this.queriedNft === 'weapons') {
        this.amounts['tier'+nft.tier][nft.rarityName.toLowerCase()]++;
      }
      if (this.queriedNft === 'lands') {
        this.landSizes[nft.size.toLowerCase()]++;
        console.log(this.landSizes)
      }
      if (this.queriedNft === 'keys') {
        this.keySizes[nft.size.toLowerCase()]++;
        console.log(this.keySizes)
      }
    })
    console.log(this.userNfts);
    this.dataLoaded = true;
  }

}
