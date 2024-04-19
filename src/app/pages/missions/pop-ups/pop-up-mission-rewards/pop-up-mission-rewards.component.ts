import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MissionsMissionsService } from '../../../../shared/services/missions/missions-missions.service';

@Component({
  selector: 'app-pop-up-mission-rewards',
  templateUrl: './pop-up-mission-rewards.component.html',
  styleUrls: ['./pop-up-mission-rewards.component.scss']
})
export class PopUpMissionRewardsComponent implements OnInit {
  dataIsLoaded: boolean = false;
  rewards: any;

  constructor(
    public dialogRef: MatDialogRef<PopUpMissionRewardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private missionsService: MissionsMissionsService
  ) { }

  ngOnInit(): void {
    this.getRewardsInfo();
  }

  /**
   * Get mission last reward info
   */
  async getRewardsInfo(): Promise<any> {
    this.rewards = await this.missionsService.getUserMissionResult(this.data.level, this.data.missionId);
    console.log(this.rewards);
    this.dataIsLoaded = true;
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
