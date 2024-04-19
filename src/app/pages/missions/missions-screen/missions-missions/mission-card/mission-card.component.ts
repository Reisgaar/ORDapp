import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MissionsMissionsService } from '../../../../../shared/services/missions/missions-missions.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.scss']
})
export class MissionCardComponent implements OnInit {
  @Input() mission: any;
  @Input() userResources: any;
  endTime: number = 0;
  ongoing: boolean = false;

  constructor(
    private dialogService: DialogService,
    private missionsService: MissionsMissionsService
  ) { }

  ngOnInit(): void {
    this.endTime = this.mission.endTime;
    this.ongoing = this.mission.ongoing;
  }

  /**
   * Start the mission
   */
  async startMission(): Promise<any> {
    this.dialogService.openSoldierEquipmentMissionSelection(this.mission)
    .afterClosed().subscribe( async (selection: any) => {
      if (selection) {
        console.log(selection);
        await this.missionsService.startMission(this.mission.level, this.mission.missionId, selection.soldiers, selection.equipments, selection.vehicle).then( async (res) => {
          if (res === true) {
            this.mission.endTime = await this.missionsService.getMissionEndTime(this.mission.level, this.mission.missionId);
            this.endTime = this.mission.endTime;
            this.mission.ongoing = true;
            this.ongoing = true;
          }
        });
      }
    });
  }
  
  /**
   * Skip mission time
   */
  async skipMissionTime(): Promise<any> {
    await this.missionsService.skipMissionTime(this.mission.level, this.mission.missionId).then( async (res) => {
      if (res === true) {
        this.mission.endTime = 0;
        this.endTime = 0;
        this.mission.ongoing = false;
        this.ongoing = false;
      }
    });
  }
  
  /**
   * End mission
   */
  async endMission(): Promise<any> {
    await this.missionsService.endMission(this.mission.level, this.mission.missionId).then( async (res) => {
      if (res === true) {
        this.mission.endTime = 0;
        this.endTime = 0;
        this.mission.ongoing = false;
        this.ongoing = false;
      }
    });
  }

  /**
   * Receive data from countdown
   * @param $event 
   */
  async receiveCounterData($event): Promise<any> {
    this.mission.endTime = 0;
    this.endTime = 0;
    this.mission.ongoing = false;
    this.ongoing = false;
  }
}
