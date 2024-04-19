import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissionsScreenComponent } from './missions-screen.component';
import { MissionsArmoryComponent } from './missions-armory/missions-armory.component';
import { MissionsBankComponent } from './missions-bank/missions-bank.component';
import { MissionsGarageComponent } from './missions-garage/missions-garage.component';
import { MissionsHomeComponent } from '../missions-home/missions-home.component';
import { MissionsMissionsComponent } from './missions-missions/missions-missions.component';
import { MissionsRecruitmentComponent } from './missions-recruitment/missions-recruitment.component';
import { MissionsRestingComponent } from './missions-resting/missions-resting.component';
import { MissionsWarehouseComponent } from './missions-warehouse/missions-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component: MissionsScreenComponent,
    children: [
      // MISSIONS
      {
        path: '',
        component: MissionsHomeComponent
      },
      {
        path: 'recruitment',
        component: MissionsRecruitmentComponent
      },
      {
        path: 'armory',
        component: MissionsArmoryComponent
      },
      {
        path: 'garage',
        component: MissionsGarageComponent
      },
      {
        path: 'warehouse',
        component: MissionsWarehouseComponent
      },
      {
        path: 'restingArea',
        component: MissionsRestingComponent
      },
      {
        path: 'bank',
        component: MissionsBankComponent
      },
      {
        path: 'missionsSelection',
        component: MissionsMissionsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsScreenRoutingModule { }
