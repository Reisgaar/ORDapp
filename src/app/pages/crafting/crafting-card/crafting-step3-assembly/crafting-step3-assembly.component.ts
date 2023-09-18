import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { armorEnum, rarityBoosterProbabilities, weaponEnum } from 'src/app/constants/craftingData';

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

  ngOnInit(): void {
    if (this.poolData.nftType === 0) {
      this.weapon = armorEnum[this.poolData.itemId];
    } else {
      this.weapon = weaponEnum[this.poolData.itemId];
    }
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
}
