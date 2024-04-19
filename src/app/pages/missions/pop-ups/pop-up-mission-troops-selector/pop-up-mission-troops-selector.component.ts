import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MissionsArmoryService } from 'src/app/shared/services/missions/missions-armory.service';
import { MissionsSharedService } from 'src/app/shared/services/missions/missions-shared.service';
import { MissionsMissionsService } from '../../../../shared/services/missions/missions-missions.service';
import { MissionsGarageService } from '../../../../shared/services/missions/missions-garage.service';

@Component({
  selector: 'app-pop-up-mission-troops-selector',
  templateUrl: './pop-up-mission-troops-selector.component.html',
  styleUrls: ['./pop-up-mission-troops-selector.component.scss']
})
export class PopUpMissionTroopsSelectorComponent implements OnInit {
  dataIsLoaded: boolean = false;
  loopArray: number[] = [];
  selection: any = { soldiers: [], equipments: [], vehicle: -1 };
  userSoldiers: any[];
  userEquipments: any[] = [];
  userEquipmentsProbabilities: any[] = [];
  userEquipmentsDurabilities: any[] = [];
  userVehiclesAvailable: any = [false, false, false];
  step: number = 0;
  editingSlot: number;
  probabilityByItem = [ [1,3,5], [3,5,6,7], [5,6,7,8,9] ]; // tier - rarity
  vehiclesTimeReduction: number[] = [0,0,0];
  durationWithReduction: string = '';

  constructor(
    public dialogRef: MatDialogRef<PopUpMissionTroopsSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private armoryService: MissionsArmoryService,
    private missionsService: MissionsMissionsService,
    private missionsSharedService: MissionsSharedService,
    private garageService: MissionsGarageService
  ) {
    console.log(data)
  }

  ngOnInit(): void {
    this.getUserInfo();
    for (let i = 0; i < this.data.mission.requirements.numSoldiers; i++) {
      this.loopArray.push(i);
      this.selection.soldiers[i] = -1;
      this.selection.equipments[i] = -1;
    }
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  sendData(): void {
    this.dialogRef.close(this.selection);
  }

  /**
   * Get all needed user info
   */
  async getUserInfo(): Promise<any> {
    this.userSoldiers = await this.missionsSharedService.getUserSoldiersInfo();
    console.log(this.userSoldiers);
    this.userEquipmentsProbabilities = await this.missionsService.getUserEquipmentsProtection();
    this.userEquipmentsDurabilities = await this.missionsService.getUserEquipmentsMinDurability();
    console.log(this.userEquipmentsDurabilities);
    console.log(this.userEquipmentsProbabilities);
    await this.getVehicles();
    this.vehiclesTimeReduction = await this.getVehiclesTimeReduction();
    for (let i = 0; i < 10; i++) {
      const equipedNFTs = await this.getEquipment(i);
      this.userEquipments.push(equipedNFTs);
    }
    console.log(this.userEquipments);
    this.dataIsLoaded = true;
  }
  
  /**
   * Get equipment info
   * @param slot 
   * @returns 
   */
  async getEquipment(slot: number): Promise<any> {
    const equipment = await this.armoryService.getUserEquipmentInfo(slot);
    return { probability: this.userEquipmentsProbabilities[slot], isInRepair: equipment.inRepair, isInUse: equipment.inUse };
  }
  
  /**
   * Get the vehicles times reduction
   * @returns 
   */
  async getVehiclesTimeReduction(): Promise<any> {
    return await this.missionsService.getVehiclesTimeReduction();
  }

  /**
   * Get user vehicles
   */
  async getVehicles(): Promise<any> {
    const ships = await this.garageService.getUserStakedVehicles();
    console.log(ships)
    this.userVehiclesAvailable[0] = ships[0].some(ship => ship.staked === true && ship.inUse === false);
    this.userVehiclesAvailable[1] = ships[1].some(ship => ship.staked === true && ship.inUse === false);
    this.userVehiclesAvailable[2] = ships[2].some(ship => ship.staked === true && ship.inUse === false);
    console.log(this.userVehiclesAvailable);
  }

  /**
   * Start the selection of clicked soldier/equipment
   * @param slot 
   */
  startSelection(slot: number): void {
    this.selection.soldiers[slot] = -1;
    this.selection.equipments[slot] = -1;
    this.editingSlot = slot;
    this.step = 1;
  }
  
  /**
   * Select the given soldier
   * @param soldierNum 
   */
  selectSoldier(soldierNum: number): void {
    this.selection.soldiers[this.editingSlot] = soldierNum;
    this.step = 2;
    console.log(this.selection.soldiers);
  }
  
  /**
   * Select the given equipment
   * @param equipmentNum 
   */
  selectEquipment(equipmentNum: number): void {
    this.selection.equipments[this.editingSlot] = equipmentNum;
    this.step = 0;
    console.log(this.selection.equipments);
  }

  /**
   * Select the vehicle type
   * @param type 
   */
  async selectVehicle(type: number): Promise<any> {
    this.selection.vehicle = type;
  }

  /**
   * Closes the pop up
   */
  selectTroops(selection: any): void {
    this.dialogRef.close(selection);
  }

}
