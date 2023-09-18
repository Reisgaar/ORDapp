import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CeilPipe } from './ceil.pipe';
import { DeleteWhitespacesPipe } from './deleteWhitespaces.pipe';
import { FloorPipe } from './floor.pipe';
import { ParseNumberPipe } from './parseNumber.pipe';
import { ShortWalletPipe } from './shortWallet.pipe';
import { FormatTimePipe } from './timeFormat.pipe';
import { TimeStampIsPastPipe } from './timeStampIsPast.pipe';
import { ToTickerPipe } from './toTicker.pipe';
import { WalletFirstNumPipe } from './walletImage.pipe';
import { WalletSpeciePipe } from './walletSpecie';
import { FromWeiPipe } from './fromWei.pipe';
import { NftContractToNamePipe } from './nftContractToName.pipe';
import { NftContractToVariablePipe } from './nftContractToVariable.pipe';
import { MaterialToTickerPipe } from './materialToTicker';



@NgModule({
  declarations: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FromWeiPipe,
    ParseNumberPipe,
    ShortWalletPipe,
    FormatTimePipe,
    TimeStampIsPastPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    MaterialToTickerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FromWeiPipe,
    ParseNumberPipe,
    ShortWalletPipe,
    FormatTimePipe,
    TimeStampIsPastPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    MaterialToTickerPipe
  ]
})
export class PipesModule { }
