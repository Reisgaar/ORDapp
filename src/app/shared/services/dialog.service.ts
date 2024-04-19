import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpInfoComponent } from '../components/pop-ups/pop-up-info/pop-up-info.component';
import { PopUpLootboxInfoComponent } from 'src/app/pages/lootbox/pop-up-lootbox-info/pop-up-lootbox-info.component';
import { PopUpLootboxRewardsComponent } from 'src/app/pages/lootbox/pop-up-lootbox-rewards/pop-up-lootbox-rewards.component';
import { PartnerPopUpBaskoniaFaqComponent } from 'src/app/pages/marketplace/partners/partner-pop-up-baskonia-faq/partner-pop-up-baskonia-faq.component';
import { PopUpSpecieSelectorComponent } from '../components/pop-ups/pop-up-specie-selector/pop-up-specie-selector.component';
import { PopUpConfirmationComponent } from '../components/pop-ups/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpGeneralComponent } from 'src/app/pages/defi/defi-common/pop-up-general/pop-up-general.component';
import { PopUpGetMaterialsComponent } from '../components/pop-ups/pop-up-get-materials/pop-up-get-materials.component';
import { PopUpNumberInputComponent } from '../components/pop-ups/pop-up-number-input/pop-up-number-input.component';
import { PopUpGetNftsComponent } from '../components/pop-ups/pop-up-get-nfts/pop-up-get-nfts.component';
import { PopUpNftSelectorComponent } from '../components/pop-ups/pop-up-nft-selector/pop-up-nft-selector.component';
import { PopUpRestingSoldierSelectorComponent } from 'src/app/pages/missions/pop-ups/pop-up-resting-soldier-selector/pop-up-resting-soldier-selector.component';
import { PopUpMissionTroopsSelectorComponent } from 'src/app/pages/missions/pop-ups/pop-up-mission-troops-selector/pop-up-mission-troops-selector.component';
import { PopUpMissionRewardsComponent } from 'src/app/pages/missions/pop-ups/pop-up-mission-rewards/pop-up-mission-rewards.component';

/**
 * Service to manage some dialogs (Not added all pop ups to avoid circular dependencies)
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog
  ) { }

  /**
   * Opens an standard dialog valid to multiple messages
   * @param title : the title to show on the pop up
   * @param text : the text to show on the pop up
   * @param detail : the detail to show on the pop up
   * @returns : the dialog
   */
  openRegularInfoDialog(title: string, text: string, detail: string, link?: string, tx?: string): any {
    if (link && tx) {
      return this.dialog.open(PopUpInfoComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { title, text, detail, link, tx }
      });
    } else if (link && !tx) {
      return this.dialog.open(PopUpInfoComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { title, text, detail, link }
      });
    } else {
      return this.dialog.open(PopUpInfoComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { title, text, detail }
      });
    }
  }

  /**
   * Opens an info dialog for the lootboxes
   * @param text : the text to show on the pop up
   * @param price : price of the lootbox
   * @param paymentCoin : payment coin used to buy the lootbox
   * @param tier : tier of the lootbox
   * @param error : error if is an error message
   * @returns
   */
  openInfoDialog(text: any, price: any, paymentCoin: any, tier: number | null, error?: any): any {
      return this.dialog.open(PopUpLootboxInfoComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { text, price, tier, paymentCoin, error }
    });
  }

  /**
   * Opens a dialog to select an specie
   * @returns
   */
  openConfirmationDialog(messages: string[]): any {
      return this.dialog.open(PopUpConfirmationComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { messages }
    });
  }

  /**
   * Opens a dialog with a number input
   * @returns
   */
  openNumberInputDialog(titleRoute: string, messageRoute: string, popUpLabelRoute: string): any {
      return this.dialog.open(PopUpNumberInputComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { titleRoute, messageRoute, popUpLabelRoute }
    });
  }

  /**
   * Opens a dialog to select an specie
   * @returns
   */
  openSpecieSelectorDialog(): any {
      return this.dialog.open(PopUpSpecieSelectorComponent, {
      panelClass: 'lootbox-dialog-container'
    });
  }

  /**
   * Opens a dialog with materials getting options
   * @returns
   */
  openGetMaterialsDialog(): any {
      return this.dialog.open(PopUpGetMaterialsComponent, {
      panelClass: 'lootbox-dialog-container',
      autoFocus: false
    });
  }

  /**
   * Opens a dialog with NFT getting options
   * @returns
   */
  openGetNFTsDialog(): any {
      return this.dialog.open(PopUpGetNftsComponent, {
      panelClass: 'lootbox-dialog-container',
      autoFocus: false
    });
  }

  /**
   * Opens a pop up with the rewards of the lootbox
   * @param transaction : transaction of the lootbox buy
   */
  openLootboxRewards(transaction: any): void {
    this.dialog.open(PopUpLootboxRewardsComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { transaction }
    });
  }

  /*
  * Opens Baskonia FAQ pop up
  */
  openBaskoniaDialog(): any {
    return this.dialog.open(PartnerPopUpBaskoniaFaqComponent, {
      panelClass: 'lootbox-dialog-container'
    });
  }

    /*
  * Opens DeFi pop up
  */
  openDefiDialog(link): any {
    return this.dialog.open(PopUpGeneralComponent, {
      panelClass: 'lootbox-dialog-container',
      data: {link}
    });
  }

  /**
   * Opens a dialog to select an specie
   * @returns
   */
  openNFTSelectorDialog(nftContractAddress: string, userAddress: string, showTierRarityFilter: boolean, isClanShip?: boolean, armorFilter?: string): any {
    if (isClanShip) {
      return this.dialog.open(PopUpNftSelectorComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { nftContractAddress, userAddress, isClanShip, showTierRarityFilter }
      });
    } else if (armorFilter) {
      return this.dialog.open(PopUpNftSelectorComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { nftContractAddress, userAddress, armorFilter, showTierRarityFilter }
      });
    } else {
      return this.dialog.open(PopUpNftSelectorComponent, {
        panelClass: 'lootbox-dialog-container',
        data: { nftContractAddress, userAddress, showTierRarityFilter }
      });
    }
  }

  /**
   * Opens a dialog to select a soldier to start resting
   * @returns
   */
  openRestingSoldierSelectorDialog(soldiers: any): any {
    return this.dialog.open(PopUpRestingSoldierSelectorComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { soldiers }
    });
  }

  /**
   * Opens a dialog to select a soldiers and equipments to start mission
   * @returns
   */
  openSoldierEquipmentMissionSelection(mission: any): any {
    return this.dialog.open(PopUpMissionTroopsSelectorComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { mission }
    });
  }

  /**
   * Opens an standard dialog valid to multiple messages
   * @param title : the title to show on the pop up
   * @param text : the text to show on the pop up
   * @param detail : the detail to show on the pop up
   * @param link : the link text
   * @param tx : the transaction hash
   * @param level : the level of the mission
   * @param missionId : the id of the mission
   * @returns : the dialog
   */
  openMissionRewardDialog(title: string, text: string, detail: string, link: string, tx: string, level: number, missionId: number): any {
    return this.dialog.open(PopUpMissionRewardsComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { title, text, detail, link, tx, level, missionId }
    });
  }


}
