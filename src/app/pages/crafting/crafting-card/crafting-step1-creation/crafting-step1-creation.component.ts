import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { armorList, weaponList } from 'src/app/constants/craftingData';

@Component({
  selector: 'app-crafting-step1-creation',
  templateUrl: './crafting-step1-creation.component.html',
  styleUrls: ['./crafting-step1-creation.component.scss']
})
export class CraftingStep1CreationComponent implements OnInit {
  @Input() pool: number;
  @Input() poolData: any;
  items = [armorList, weaponList];
  selectedType = 1; // 0 for armor, 1 for weapon
  selectedWeapon = 0;
  selectedArmor = 0;
  selectedElement = 0; // 1 for laser, 0 for non laser
  @Output() dataEvent = new EventEmitter<any>();
  data: any = {};

  constructor() {}

  ngOnInit(): void {
    this.data = { type: this.selectedType, item: this.items[1][this.selectedWeapon], element: this.selectedElement, tier: this.pool + 1 };
    this.dataEvent.emit(this.data);
  }

  sendDataToParent(): void {
    if (this.selectedType === 1) {
      this.data = { type: this.selectedType, item: this.items[1][this.selectedWeapon], element: this.selectedElement, tier: this.pool + 1 };
    } else {
      this.data = { type: this.selectedType, item: this.items[0][this.selectedArmor], element: this.selectedElement, tier: this.pool + 1 };
    }
    this.dataEvent.emit(this.data);
  }

  /**
   * Changes between types (0 is weapon, 1 is armor)
   */
  changeSelectedType(): void {
    if (this.selectedType === 0) {
      this.selectedType = 1;
    } else {
      this.selectedType = 0;
    }
    this.sendDataToParent();
  }

  /**
   * Sets the selected weapon/armor with given param
   * @param type type to change (0 is weapon, 1 is armor)
   * @param newSelection new selected item
   */
  setSelectedWeaponOrArmor(type: number, newSelection: number): void {
    if (type === 1) {
      this.selectedWeapon = newSelection;
    } else {
      this.selectedArmor = newSelection;
    }
    this.sendDataToParent();
  }

  /**
   * Changes between selected item type
   * @param move +1 or -1 to move a step
   * @param type type to move (0 is weapon, 1 is armor)
   */
  changeSelectedItem(move: number, type: number): void {
    if (type === 1) {
      this.changeSelectedWeapon(move);
    } else {
      this.changeSelectedArmor(move);
    }
    this.sendDataToParent();
  }

  /**
   * Change the selected weapon
   * @param move +1 or -1 to move a step
   */
  changeSelectedWeapon(move: number): void {
    if (this.selectedWeapon + move < 0) {
      this.selectedWeapon = this.items[1].length - 1;
    } else if (this.selectedWeapon + move >= this.items[1].length) {
      this.selectedWeapon = 0;
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
    } else if (this.selectedArmor + move >= this.items[0].length) {
      this.selectedArmor = 0;
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
    this.sendDataToParent();
  }

}
