import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { armorEnum, stylingPartsOrder, weaponEnum, weaponPartsInfo, weaponPartsOrder } from 'src/app/constants/craftingData';

@Component({
  selector: 'app-crafting-step2-styling',
  templateUrl: './crafting-step2-styling.component.html',
  styleUrls: ['./crafting-step2-styling.component.scss']
})
export class CraftingStep2StylingComponent implements OnInit {
  @Input() poolData: any;
  weapon = '';
  element = 0;
  showPreview: boolean = false;
  weaponPartsOrder: any = weaponPartsOrder;
  weaponParts: any = {};
  selectedArmorAesthetic: number = 1;
  addOnsAdded: boolean = false;
  @Output() dataEvent = new EventEmitter<number[]>();
  outputData: number[] = [];
  actualDiceRotation: number = 70;
  diceStyle: string = 'rotate: 45deg; transform: rotate3d(3, 2, 0, 70deg);';


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
  }

  /**
   * Sends data to parent component
   */
  sendDataToParent(): void {
    this.dataEvent.emit(this.getArrayToSend());
  }

  /**
   * Gets the array to send to parent
   * @returns aesthetic array
   */
  getArrayToSend(): any {
    if (this.poolData.nftType === 1) {
      let addOnAmount: number = 0;
      const aestheticArray = [];
      const partsOrder = stylingPartsOrder[this.weapon];
      for (let part in this.weaponParts) {
        if (!['accessories', 'sights', 'underBarrel'].includes(part)) {
          aestheticArray[partsOrder.indexOf(part)] = this.weaponParts[part].aesthetic + 1;
        }
      }
      for (let part in this.weaponParts.accessories) {
        aestheticArray[partsOrder.indexOf(part)] = this.weaponParts.accessories[part].aesthetic + 1;
        if ((this.weaponParts.accessories[part].aesthetic + 1) > 0) {
          addOnAmount++;
        }
      }
      for (let part in this.weaponParts.underBarrel) {
        aestheticArray[partsOrder.indexOf(part)] = this.weaponParts.underBarrel[part].aesthetic + 1;
        if ((this.weaponParts.underBarrel[part].aesthetic + 1) > 0) {
          addOnAmount++;
        }
      }
      for (let part in this.weaponParts.sights) {
        aestheticArray[partsOrder.indexOf(part)] = this.weaponParts.sights[part].aesthetic + 1;
        if ((this.weaponParts.sights[part].aesthetic + 1) > 0) {
          addOnAmount++;
        }
      }
      return { aestheticArray, addOnAmount};
    } else {
      return {aestheticArray: [this.selectedArmorAesthetic], addOnAmount: 0};
    }
  }

  /**
   * Switches the visibility preview popUp
   * @param isOpen true for visible, false for hidden
   */
  switchPreviewTo(isOpen: boolean): void {
    this.showPreview = isOpen;
  }

  /**
   * Sets the selected parts for the weapon
   */
  setSelectedParts(): void {
    let auxNum = 0;
    if (this.poolData.started === false) { auxNum = 1; }
    for (let part in weaponPartsInfo[this.element][this.weapon]) {
      if (['accessories', 'sights', 'underBarrel'].includes(part)) {
        for (let subPart in weaponPartsInfo[this.element][this.weapon][part]) {
          if (!this.weaponParts[part]) {
            this.weaponParts[part] = {};
          }
          const aesthetic = this.getPoolNFTAesthetic(subPart);
          this.weaponParts[part][subPart] = { aesthetic: (aesthetic - auxNum), showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part][subPart]};
        }
      } else {
        const aesthetic = this.getPoolNFTAesthetic(part);
        this.weaponParts[part] = { aesthetic, showOnPreview: true, parts: weaponPartsInfo[this.element][this.weapon][part]};
      }
    }
    this.sendDataToParent();
  }

  /**
   * Get the aesthetic of the pool NFT
   * @param part part name
   * @returns aesthetic number
   */
  getPoolNFTAesthetic(part: string): number {
    if (this.poolData.started === true) {
      const weaponName = weaponEnum[this.poolData.itemId];
      const indexOfAesthetic = stylingPartsOrder[weaponName].indexOf(part);
      return this.poolData.parts[indexOfAesthetic] - 1;
    } else {
      return 0;
    }
  }

  /**
   * Changes the selected armor aesthetic
   * @param sum -1 or 1 to move
   */
  changeSelectedArmorAesthetic(sum: number): void {
    if ((this.selectedArmorAesthetic + sum) < 1) {
      this.selectedArmorAesthetic = 5;
    } else if ((this.selectedArmorAesthetic + sum) > 5) {
      this.selectedArmorAesthetic = 1;
    } else {
      this.selectedArmorAesthetic += sum;
    }
    this.sendDataToParent();
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
    this.sendDataToParent();
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
    this.addOnsAdded = this.checkAddons();
    this.sendDataToParent();
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
   * Check if addons are selected
   * @returns true if any addon is selected
   */
  checkAddons(): boolean {
    let aux: boolean = false;
    console.log(this.weaponParts);
    if (this.weaponParts.accessories) {
      Object.keys(this.weaponParts.accessories).forEach( (part: any) => {
        if (this.weaponParts.accessories[part].aesthetic !== -1) { aux = true; }
      });
    }
    if (this.weaponParts.sights) {
      Object.keys(this.weaponParts.sights).forEach( (part: any) => {
        if (this.weaponParts.sights[part].aesthetic !== -1) { aux = true; }
      });
    }
    if (this.weaponParts.underBarrel) {
      Object.keys(this.weaponParts.underBarrel).forEach( (part: any) => {
        if (this.weaponParts.underBarrel[part].aesthetic !== -1) { aux = true; }
      });
    }
    return aux;
  }

  /**
   * Randomize the weapon part selection
   */
  randomize(): void {
    this.rotateDice();
    for (let part in this.weaponParts) {
      if (['accessories', 'sights', 'underBarrel'].includes(part)) {
        for (let subpart in this.weaponParts[part]) {
          this.weaponParts[part][subpart].aesthetic = -1;
        }
        const optionalPartAmount = Object.keys(this.weaponParts[part]).length;
        const randomPartNum = Math.floor(Math.random() * optionalPartAmount);
        const randomPartName = Object.keys(this.weaponParts[part])[randomPartNum];
        const randomAesthetic = Math.floor(Math.random() * (this.weaponParts[part][randomPartName].parts.length + 1)) - 1;
        this.weaponParts[part][randomPartName].aesthetic = randomAesthetic;
      } else {
        const randomAesthetic = Math.floor(Math.random() * this.weaponParts[part].parts.length);
        this.weaponParts[part].aesthetic = randomAesthetic;
      }
    }
    this.addOnsAdded = this.checkAddons();
    this.sendDataToParent();
  }

  /**
   * Change dice style to make it roll
   */
  rotateDice(): void {
    let posOrNeg = 1;
    if (Math.random() < 0.5) { posOrNeg = -1 };
    const newRotation = this.actualDiceRotation + ((Math.floor(Math.random() * (700 - 600 + 1)) + 600) * posOrNeg);
    this.actualDiceRotation = newRotation;
    const generalRotate = (Math.floor(Math.random() * 360 ) + 1) * posOrNeg;
    this.diceStyle = 'rotate: ' + generalRotate + 'deg; transform: rotate3d(3, 2, 0, ' + newRotation + 'deg);';
  }
}
