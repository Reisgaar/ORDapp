import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { armorEnum, craftingMaterialCost, userOwnedMaterials, weaponEnum } from 'src/app/constants/craftingData';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { CraftingAssemblyService } from 'src/app/shared/services/crafting/crafting-assembly.service';
import { CraftingCreationService } from 'src/app/shared/services/crafting/crafting-creation.service';
import { CraftingStylingService } from 'src/app/shared/services/crafting/crafting-styling.service';
import { CraftingUtilsService } from 'src/app/shared/services/crafting/crafting-utils.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-crafting-card',
  templateUrl: './crafting-card.component.html',
  styleUrls: ['./crafting-card.component.scss']
})
export class CraftingCardComponent implements OnInit, OnDestroy {
  @Input() step: number;
  @Input() pool: number;
  @Input() discounts: any;
  steps: string[] = ['Creation', 'Styling', 'Assembly'];
  weapon: string = 'blade';
  tier: number;
  itemData: any;
  materialCost = craftingMaterialCost;
  userMaterials = userOwnedMaterials;
  nextStepAllowed: boolean;
  poolDataLoaded: boolean = false;
  poolData: any;
  step2Array: number[] = [];
  step2AddOnAmount: number = 0;
  step3Booster: number = 0;
  poolPrice: string = '';
  poolPriceInGQ: string = '';
  craftingStartFee: string = '';
  interval: any;
  userCraftedAmounts: any;

  constructor(
    private connectionService: ConnectionService,
    private craftingUtilsService: CraftingUtilsService,
    private craftingCreationService: CraftingCreationService,
    private craftingStylingService: CraftingStylingService,
    private craftingAssemblyService: CraftingAssemblyService,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.tier = this.pool + 1;
    await this.getPoolData();
    await this.getPoolPrice();
    this.interval = setInterval(() => {
      this.checkIfNextStepIsAvailable();
    }, 2000);
    this.craftingUtilsService.userCraftedAmounts.subscribe( (data) => {
      this.userCraftedAmounts = data;
    });
  }

  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets the data of the pool
   */
  async getPoolData(): Promise<void> {
    this.poolData = await this.craftingUtilsService.getPoolData(this.step, this.pool);
    if (this.poolData.exists) {
      this.itemData = {
        type: this.poolData.nftType,
        item: this.getItemName(this.poolData.nftType, this.poolData.itemId),
        element: this.poolData.element,
        tier: this.poolData. tier
      };
    } else {
      this.itemData = this.itemData ? this.itemData : { type: 1, item: 'blade', element: 2, tier: (this.pool + 1) };
    }
    console.log('Item data:', this.itemData);
    console.log('Pool data:', this.poolData);
    this.checkIfNextStepIsAvailable();
    if (this.step === 3 && this.poolData.started === true && this.poolData.rarity > 4) {
      await this.getPoolData();
    }
    this.poolDataLoaded = true;
  }

  /**
   * Gets the price of the pool
   */
  async getPoolPrice(): Promise<void> {
    if (this.step === 1) {
      this.poolPrice = await this.craftingCreationService.getPoolPrice(this.pool);
      this.poolPriceInGQ = await this.craftingCreationService.getPoolPriceInGQ(this.pool);
      this.craftingStartFee = await this.craftingUtilsService.getCraftingFeeInUSD();
    } else if (this.step === 2) {
      const poolPriceWei = await this.craftingStylingService.getPoolAddOnPrice(this.itemData.tier, this.step2AddOnAmount);
      this.poolPrice = poolPriceWei !== '' ? poolPriceWei : '';
      const poolPriceInGQWei = await this.craftingStylingService.getPoolAddOnPriceInGQ(this.itemData.tier, this.step2AddOnAmount);
      this.poolPriceInGQ = poolPriceInGQWei !== '' ? poolPriceInGQWei : '';
    } else if (this.step === 3) {
      const poolPriceWei = await this.craftingAssemblyService.getRarityPrice(this.itemData.tier, this.step3Booster);
      this.poolPrice = poolPriceWei !== '' ? this.connectionService.fromWei(poolPriceWei).toString() : '';
      const poolPriceInGQWei = await this.craftingAssemblyService.getRarityPriceInGQ(this.itemData.tier, this.step3Booster);
      this.poolPriceInGQ = poolPriceInGQWei !== '' ? this.connectionService.fromWei(poolPriceInGQWei).toString() : '';
    }
    console.log('Price $$: ', this.poolPrice)
    console.log('Price GQ: ', this.poolPriceInGQ)
  }

  /**
   * Gets the item name
   * @param nftType type of the NFT, 0 armor, 1 weapon
   * @param itemId the id of the item
   * @returns name of the item
   */
  getItemName(nftType: number, itemId: number): string {
    if (nftType === 0) {
      return armorEnum[itemId];
    } else {
      return weaponEnum[itemId];
    }
  }

  /**
   * Receive data for Step 1
   * @param $event
   */
  receiveDataStep1($event: any): void {
    if (this.poolData.exists === false) {
      this.itemData = $event;
      this.checkIfNextStepIsAvailable();
    }
  }

  /**
   * Receive data for Step 2
   * @param $event
   */
  receiveDataStep2($event: any): void {
    this.step2Array = $event.aestheticArray;
    this.step2AddOnAmount = $event.addOnAmount;
    this.getPoolPrice();
  }

  /**
   * Receive data for Step 2
   * @param $event
   */
  receiveDataStep3($event: any): void {
    this.step3Booster = $event;
    this.getPoolPrice();
  }

  async receiveCounterData($event: any): Promise<void> {
    await this.getPoolData();
  }

  /**
   * Check if material is enough, transforms received string on number
   * @param userAmount user material amount
   * @param value value
   * @returns true if is enough
   */
  checkIfMaterialIsEnough(userAmount: string, value: number): boolean {
    if (parseFloat(userAmount) >= value) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if next step is available
   */
  checkIfNextStepIsAvailable(): void {
    let auxBoolean: boolean = true;
    const stepMaterials = this.materialCost[this.itemData.item]['t' + this.itemData.tier]['step' + this.step];
    for (let mat in stepMaterials) {
      const valueWithDiscount = stepMaterials[mat] - (stepMaterials[mat] * (this.discounts.cost / 100));
      if (!this.checkIfMaterialIsEnough(this.connectionService.fromWei(userOwnedMaterials[mat].amount), valueWithDiscount)) {
        auxBoolean = false;
      }
    }
    this.nextStepAllowed = auxBoolean;
  }

  /**
   * Opens the pop up with material getting options
   */
  openGetMaterialsDialog(): void {
    this.dialogService.openGetMaterialsDialog();
  }

  /**
   * Starts the creation step
   */
  async startCreation(): Promise<any> {
    let itemId: number;
    if (this.itemData.type === 1) {
      itemId = await this.craftingUtilsService.getWeaponIdByName(this.itemData.item.toLowerCase())
    } else {
      itemId = await this.craftingUtilsService.getArmourIdByName(this.itemData.item.toLowerCase());
    }
    let elementToSend = this.itemData.element;
    if (elementToSend === 0 && itemId < 3) {
      elementToSend = 2;
    }
    if ( this.itemData.type === 1 && (itemId === 5 || itemId === 6) && (weaponEnum[itemId] === 'shotgun' || weaponEnum[itemId] === 'repeaterShotgun')) {
      elementToSend = 0;
    }
    const stepMaterials = this.materialCost[this.itemData.item]['t' + this.itemData.tier]['step' + this.step];
    await this.craftingCreationService.startCrafting(stepMaterials, this.pool, this.itemData.type, itemId, this.tier, elementToSend).then( () => {
      this.getPoolData();
    });
  }

  /**
   * Starts the styling step
   */
  async startStyling(): Promise<any> {
    const stepMaterials = this.materialCost[this.itemData.item]['t' + this.itemData.tier]['step' + this.step];
    await this.craftingStylingService.startStyling(stepMaterials, this.pool, this.step2Array, this.itemData.tier, this.step2AddOnAmount).then( () => {
      this.getPoolData();
    });
  }

  /**
   * Starts the assembly step
   */
  async startAssembly(): Promise<any> {
    const stepMaterials = this.materialCost[this.itemData.item]['t' + this.itemData.tier]['step' + this.step];
    await this.craftingAssemblyService.startAssembly(stepMaterials, this.pool, this.step3Booster, this.itemData.tier).then( () => {
      this.getPoolData();
    });}

  /**
   * Accelerate the process
   */
  async accelerateProcess(): Promise<void> {
    if (this.step === 1) {
      await this.craftingCreationService.accelerateProcess(this.pool).then( () => {
        this.getPoolData();
      });
    } else if (this.step === 2) {
      await this.craftingStylingService.accelerateProcess(this.pool).then( () => {
        this.getPoolData();
      });
    } else if (this.step === 3) {
      await this.craftingAssemblyService.accelerateProcess(this.pool).then( () => {
        this.getPoolData();
      });
    }
  }

  /**
   * Ends the process
   */
  async endProcess(): Promise<void> {
    if (this.step === 1) {
      await this.craftingCreationService.endProcess(this.pool).then( () => {
        this.getPoolData();
      });
    } else if (this.step === 2) {
      await this.craftingStylingService.endProcess(this.pool).then( () => {
        this.getPoolData();
      });
    } else if (this.step === 3) {
      await this.craftingAssemblyService.endProcess(this.pool).then( () => {
        this.getPoolData();
      });
    }
  }
}
