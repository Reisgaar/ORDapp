import { Component, OnInit } from '@angular/core';
import { armorList, rarityBoosterProbabilities, weaponList, weaponPartsInfo, weaponPartsOrder } from 'src/app/constants/craftingData';

@Component({
  selector: 'app-crafting-home',
  templateUrl: './crafting-home.component.html',
  styleUrls: ['./crafting-home.component.scss']
})
export class CraftingHomeComponent implements OnInit {
  weaponList = ['blade', 'blunt', 'knife', 'pistol', 'revolver', 'shotgun', 'repeaterShotgun', 'assaultSMG', 'highRateSMG', 'assaultRifle', 'lightMachinegun', 'sniperRifle', 'precisionRifle'];
  weapon = 'assaultRifle';
  element = 0; //  0 = non laser, 1 = laser
  weaponPartsOrder: any = weaponPartsOrder;
  weaponParts: any = {};
  tier = 1;
  engineers = ['Trainee', 'Junior', 'Senior', 'Expert', 'Master'];
  selectedEngineer = 0;
  boosters = rarityBoosterProbabilities;
  items = [weaponList, armorList];
  selectedWeapon = 0;
  selectedArmor = 0;
  selectedElement = 0; // 0 for non laser, 1 for laser

  constructor() { }

  ngOnInit(): void {
    this.setSelectedParts();
    console.log(this.weaponParts);
  }

  /**
   * Sets the selected parts for the weapon
   */
  setSelectedParts(): void {
    this.weaponParts = {};
    for (let part in weaponPartsInfo[this.element][this.weapon]) {
      if (['accessories', 'sights', 'underBarrel'].includes(part)) {
        for (let subPart in weaponPartsInfo[this.element][this.weapon][part]) {
          if (!this.weaponParts[part]) {
            this.weaponParts[part] = {};
          }
          this.weaponParts[part][subPart] = { aesthetic: -1, showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part][subPart]};
        }
      } else {
        this.weaponParts[part] = { aesthetic: 0, showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part]};
      }
    }
  }

  /**
   * Changes the image aesthetic of the given part
   * @param sum +1 or -1 to move a step
   * @param partName the name of the part
   */
  changeMainImagePart(sum: number, partName: string): void {
    const part = this.weaponParts[partName];
    if ((part.aesthetic + sum) < 0) {
      this.weaponParts[partName].aesthetic = part.parts.length - 1;
    } else if ((part.aesthetic + sum) >= part.parts.length) {
      this.weaponParts[partName].aesthetic = 0;
    } else {
      this.weaponParts[partName].aesthetic = part.aesthetic + sum;
    }
  }

  /**
   * Changes the image aesthetic of the given addon part
   * @param sum +1 or -1 to move a step
   * @param partName the name of the part family
   * @param subPartName the name of the part
   */
  changeAddOnImagePart(sum: number, partName: string, subPartName: string): void {
    const part = this.weaponParts[partName][subPartName];
    if ((part.aesthetic + sum) < -1) {
      this.weaponParts[partName][subPartName].aesthetic = part.parts.length - 1;
    } else if ((part.aesthetic + sum) >= part.parts.length) {
      this.weaponParts[partName][subPartName].aesthetic = -1;
    } else {
      this.weaponParts[partName][subPartName].aesthetic = part.aesthetic + sum;
    }
    this.setOtherAddonsToZero(partName, subPartName);
  }

  /**
   * Set aesthetic of addons family to 0 except the given one
   * @param partName the name of the part family
   * @param subPartName the name of the part
   */
  setOtherAddonsToZero(partName: string, subPartName: string): void {
    Object.keys(this.weaponParts[partName]).forEach( (part: any) => {
      if (this.weaponParts[partName][part].aesthetic > -1 && part.toLowerCase() !== subPartName.toLowerCase()) {
        this.weaponParts[partName][part].aesthetic = -1;
      }
    });
  }

  /**
   * Change the selected weapon on the preview
   * @param sum +1 or -1 to move a step
   */
  changeSelectedWeaponPreview(sum: number): void {
    const weaponIndex = this.weaponList.indexOf(this.weapon);
    if ((weaponIndex + sum) < 0) {
      this.weapon = this.weaponList[this.weaponList.length - 1];
    } else if ((weaponIndex + sum) >= this.weaponList.length) {
      this.weapon = this.weaponList[0];
    } else {
      this.weapon = this.weaponList[weaponIndex + sum];
    }
    this.setSelectedParts();
    console.log(this.weaponParts);
  }

  /**
   * Sets the selected element on the preview and changes weapon list
   * @param el element to change to
   */
  setElement(el: number): void {
    this.element = el;
    if (this.element === 1) {
      this.weaponList = ['blade', 'blunt', 'knife', 'pistol', 'revolver', 'assaultSMG', 'highRateSMG', 'assaultRifle', 'lightMachinegun', 'sniperRifle', 'precisionRifle'];
    } else {
      this.weaponList = ['blade', 'blunt', 'knife', 'pistol', 'revolver', 'shotgun', 'repeaterShotgun', 'assaultSMG', 'highRateSMG', 'assaultRifle', 'lightMachinegun', 'sniperRifle', 'precisionRifle'];
    }
    this.setSelectedParts();
    console.log(this.weaponParts);
  }

  /**
   * Sets the selected engineer with the given one
   * @param eng engineer to change to
   */
  setSelectedEngineer(eng: number): void {
    this.selectedEngineer = eng;
  }

  /**
   * Sets the selected tier with the given one
   * @param t tier to change to
   */
  setSelectedTier(t: number): void {
    this.tier = t;
  }

  /**
   * Changes between selected item type
   * @param move +1 or -1 to move a step
   * @param type type to move (0 is weapon, 1 is armor)
   */
  changeSelectedItem(move: number, type: number): void {
    if (type === 0) {
      this.changeSelectedWeapon(move);
    } else {
      this.changeSelectedArmor(move);
    }
  }

  /**
   * Change the selected weapon
   * @param move +1 or -1 to move a step
   */
  changeSelectedWeapon(move: number): void {
    if (this.selectedWeapon + move < 0) {
      this.selectedWeapon = this.items[10].length - 1;
    } else if (this.selectedWeapon + move >= this.items[0].length) {
      this.selectedWeapon = 0
    } else {
      this.selectedWeapon += move;
    }
  }

  /**
   * Change the selected armor
   * @param move +1 or -1 to move a step
   */
  changeSelectedArmor(move: number): void {
    if (this.selectedArmor + move < 0) {
      this.selectedArmor = this.items[0].length - 1;
    } else if (this.selectedArmor + move >= this.items[1].length) {
      this.selectedArmor = 0
    } else {
      this.selectedArmor += move;
    }
  }

  /**
   * Change the selected element (0 is laser, 1 is non-laser)
   */
  changeSelectedElement(): void {
    if (this.selectedElement === 0) {
      this.selectedElement = 1;
    } else {
      this.selectedElement = 0;
    }
  }

}
