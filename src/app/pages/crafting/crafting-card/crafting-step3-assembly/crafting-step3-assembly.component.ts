import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { armorEnum, rarityBoosterProbabilities, stylingPartsOrder, weaponEnum, weaponPartsInfo, weaponPartsOrder } from 'src/app/constants/craftingData';

@Component({
  selector: 'app-crafting-step3-assembly',
  templateUrl: './crafting-step3-assembly.component.html',
  styleUrls: ['./crafting-step3-assembly.component.scss']
})
export class CraftingStep3AssemblyComponent implements OnInit, OnChanges {
  @Input() poolData: any;
  weapon = '';
  tier = 1;
  selectedEngineer = 0;
  engineers = ['trainee', 'junior', 'senior', 'expert', 'master'];
  boosters: any = rarityBoosterProbabilities;
  @Output() dataEvent = new EventEmitter<number>();
  outputData: number[] = [];
  element = 0;
  weaponParts: any = {};
  weaponPartsOrder: any = weaponPartsOrder;
  previewWeapon: boolean = false;

  ngOnInit(): void {
    if (this.poolData.nftType === 0) {
      this.weapon = armorEnum[this.poolData.itemId];
    } else {
      this.weapon = weaponEnum[this.poolData.itemId];
    }
    if (this.poolData.element === 1) {
      this.element = this.poolData.element;
    } else {
      this.element = 0;
    }
    this.setSelectedParts();
    this.sendDataToParent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes:', changes);
    this.selectedEngineer = changes.poolData.currentValue.rarityBooster - 1;
  }

  /**
   * Sends data to parent component
   */
  sendDataToParent(): void {
    this.dataEvent.emit((this.selectedEngineer + 1));
  }

  /**
   * Change the selected engineer
   * @param sum +1 or -1 to move one step
   */
  changeSelectedEngineer(sum: number): void {
    if (this.selectedEngineer + sum < 0) {
      this.selectedEngineer = this.engineers.length - 1;
    } else if (this.selectedEngineer + sum >= this.engineers.length) {
      this.selectedEngineer = 0;
    } else {
      this.selectedEngineer += sum;
    }
    this.sendDataToParent();
  }

  /**
   * Sets the selected parts for the weapon
   */
  setSelectedParts(): void {
    for (let part in weaponPartsInfo[this.element][this.weapon]) {
      if (['accessories', 'sights', 'underBarrel'].includes(part)) {
        for (let subPart in weaponPartsInfo[this.element][this.weapon][part]) {
          if (!this.weaponParts[part]) {
            this.weaponParts[part] = {};
          }
          const aesthetic = this.getPoolNFTAesthetic(subPart);
          this.weaponParts[part][subPart] = { aesthetic: aesthetic, showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part][subPart]};
        }
      } else {
        const aesthetic = this.getPoolNFTAesthetic(part);
        this.weaponParts[part] = { aesthetic, showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part]};
      }
    }
    console.log(this.weaponParts)
  }

  /**
   * Get the aesthetic of the pool NFT
   * @param part part name
   * @returns aesthetic number
   */
  getPoolNFTAesthetic(part: string): number {
    const weaponName = weaponEnum[this.poolData.itemId];
    const indexOfAesthetic = stylingPartsOrder[weaponName].indexOf(part);
    return this.poolData.parts[indexOfAesthetic] - 1;
  }

  switchPreview(): void {
    this.previewWeapon = !this.previewWeapon;
  }
}
