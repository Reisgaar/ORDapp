import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { NftService } from 'src/app/shared/services/nft/nft.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
// ABI
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';

/**
 * Pop up to show lootbox rewards
 */
@Component({
  selector: 'app-pop-up-lootbox-rewards',
  templateUrl: './pop-up-lootbox-rewards.component.html',
  styleUrls: ['./pop-up-lootbox-rewards.component.scss']
})
export class PopUpLootboxRewardsComponent implements OnInit {
  rewardResources: any[] = [];
  rewardList: any[] = [];
  sentItems = 0;
  processedItems = 0;

  constructor(
    public dialogRef: MatDialogRef<PopUpLootboxRewardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private connectionService: ConnectionService,
    private nftService: NftService,
    private utilsService: UtilsService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    const weaponBlock = Object.keys(this.data.transaction.logs).find((x:any)=> this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.weapon.toLowerCase() && this.data.transaction.logs[x].topics.length === 3  );
    if(weaponBlock != undefined) {
      await this.setData(this.data.transaction.logs[weaponBlock], contractAddresses.weapon);
    }
    const armorBlock = Object.keys(this.data.transaction.logs).find((x:any)=> this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.armor.toLowerCase() && this.data.transaction.logs[x].topics.length === 3  );
    if(armorBlock != undefined) {
      await this.setData(this.data.transaction.logs[armorBlock], contractAddresses.armor);
    }
    const exoBlock = Object.keys(this.data.transaction.logs).find((x:any)=> this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.exocredit.toLowerCase() && this.data.transaction.logs[x].topics.length === 3  );
    if(exoBlock != undefined) {
      await this.setData(this.data.transaction.logs[exoBlock], contractAddresses.exocredit);
    }
    const clanBlock = Object.keys(this.data.transaction.logs).find((x: any) => this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.clanBadge.toLowerCase() && this.data.transaction.logs[x].topics.length === 3 );
    if (clanBlock != undefined) {
      await this.setData(this.data.transaction.logs[clanBlock], contractAddresses.clanBadge);
    }
    const landVehicleBlock = Object.keys(this.data.transaction.logs).find((x: any) => this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.landVehicle.toLowerCase() && this.data.transaction.logs[x].topics.length === 3 );
    if (landVehicleBlock != undefined) {
      await this.setData(this.data.transaction.logs[landVehicleBlock], contractAddresses.landVehicle);
    }
    const spaceVehicleBlock = Object.keys(this.data.transaction.logs).find((x: any) => this.data.transaction.logs[x].address.toLowerCase() === contractAddresses.spaceVehicle.toLowerCase() && this.data.transaction.logs[x].topics.length === 3 );
    if (spaceVehicleBlock != undefined) {
      await this.setData(this.data.transaction.logs[spaceVehicleBlock], contractAddresses.spaceVehicle);
    }
  }

  async setData(item: any, contractAddress: string): Promise<any> {
    const contract = await this.connectionService.getReadContract(ERC721.abi, contractAddress);
    item.length ? this.sentItems += item.length: this.sentItems++;
    const block = parseInt(item.blockNumber);
    let filterFrom = contract.filters.Minted();
    let logsFrom = await contract.queryFilter(filterFrom, block, block);
    for (const i of logsFrom) {
      this.getNFTDataWithRetry(parseInt(i.args.tokenId.toString()), contractAddress);
    }
  }

  /**
   * Retry until gets NFT data
   * @param tokenId : Id of the token
   * @param contractAddress : Contract of the NFT
   */
  async getNFTDataWithRetry(tokenId: number, contractAddress: string): Promise<void> {
    try {
      const nft = await this.nftService.getNftData(tokenId, contractAddress);
      console.log(nft);
      this.rewardList.push(nft);
      this.processedItems++;
    } catch {
      await this.utilsService.sleep(2000);
      this.getNFTDataWithRetry(tokenId, contractAddress);
    }
  }

  /**
   * Closes pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
