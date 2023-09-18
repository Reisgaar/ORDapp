import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefiComponent } from './defi.component';
import { DefiRoutingModule } from './defi-routing.module';
import { PoolsComponent } from './pools/pools.component';
import { FarmsComponent } from './farms/farms.component';
import { LiquidityComponent } from './liquidity/liquidity.component';
import { SwapComponent } from './swap/swap.component';
import { DefiHomeComponent } from './defi-home/defi-home.component';
import { TranslateModule } from '@ngx-translate/core';
import { DefiHeaderComponent } from './defi-common/defi-header/defi-header.component';
import { DefiSelectHeaderComponent } from './defi-common/defi-select-header/defi-select-header.component';
import { DefiCommonComponent } from './defi-common/defi-common.component';
import { PoolCardComponent } from './pool-card/pool-card.component';
import { MatIconModule } from '@angular/material/icon';
import { PopUpGeneralComponent } from './defi-common/pop-up-general/pop-up-general.component';
import { SlippageComponent } from './defi-common/slippage/slippage.component';
import { MatChipsModule } from '@angular/material/chips';
import { SettingsButtonComponent } from './defi-common/settings-button/settings-button.component';
import { PairsComponent } from './defi-common/pairs/pairs.component';
import { LiquidityAddComponent } from './liquidity-add/liquidity-add.component';
import { ApyComponent } from './defi-common/apy/apy.component';
import {MatMenuModule} from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { WithdrawPopUpComponent } from './defi-pop-up/withdraw-pop-up/withdraw-pop-up.component';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { DepositPopUpComponent } from './defi-pop-up/deposit-pop-up/deposit-pop-up.component';
import { FarmCardComponent } from './farms/farm-card/farm-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LiquidityMinusComponent } from './liquidity-minus/liquidity-minus.component';
import { PriceComponent } from './defi-common/price/price.component';
import { FromWeiPipe } from 'src/app/pipes/fromWei.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
@NgModule({
  declarations: [
    DefiComponent,
    PoolsComponent,
    FarmsComponent,
    LiquidityComponent,
    SwapComponent,
    DefiHomeComponent,
    DefiHeaderComponent,
    DefiSelectHeaderComponent,
    DefiCommonComponent,
    PoolCardComponent,
    FarmCardComponent,
    PopUpGeneralComponent,
    SlippageComponent,
    SettingsButtonComponent,
    PairsComponent,
    LiquidityAddComponent,
    PoolCardComponent,
    ApyComponent,
    WithdrawPopUpComponent,
    DepositPopUpComponent,
    LiquidityMinusComponent,
    PriceComponent
    // FromWeiPipe
  ],
  imports: [
    CommonModule,
    DefiRoutingModule,
    TranslateModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTableModule,
    MatSliderModule,
    MatDialogModule,
    FormsModule,
    PipesModule
  ],
})
export class DefiModule {}
