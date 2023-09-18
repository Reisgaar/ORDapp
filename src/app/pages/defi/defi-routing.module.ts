import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DefiComponent } from './defi.component';
import { PoolsComponent } from './pools/pools.component';
import { FarmsComponent } from './farms/farms.component';
import { LiquidityComponent } from './liquidity/liquidity.component';
import { SwapComponent } from './swap/swap.component';
import { DefiHomeComponent } from './defi-home/defi-home.component';
import { DefiCommonComponent } from './defi-common/defi-common.component';
import { LiquidityAddComponent } from './liquidity-add/liquidity-add.component';


const routes: Routes = [
  {
    path: '',
    component: DefiComponent,
    children: [
      {
        path:'',
      component: DefiHomeComponent
      },
      {
        path: 'pools',
        component: DefiCommonComponent,
        data: {msg: 'pools'}
      },
      {
        path:'farms',
      component: DefiCommonComponent,
      data: {msg: 'farms'}

      },
      {
        path:'liquidity',
        component: DefiCommonComponent,
        data: {msg: 'farms'}

      },
      {
        path:'swap',
        component: DefiCommonComponent,
        data: {msg: 'farms'}

      },
  ] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefiRoutingModule { }
