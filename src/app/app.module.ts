import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// NGX
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Apollo
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from 'apollo-angular';
import { NamedOptions } from 'apollo-angular/types';
// Pipes
// import { FromWeiPipe } from './pipes/fromWei.pipe';
// import { ToTickerPipe } from './pipes/toTicker.pipe';
// import { ShortWalletPipe } from './pipes/shortWallet.pipe';
// import { FormatTimePipe } from './pipes/timeFormat.pipe';
// import { CeilPipe } from './pipes/ceil.pipe';
// import { FloorPipe } from './pipes/floor.pipe';
import { DatePipe } from '@angular/common';
import { TimeStampIsPastPipe } from './pipes/timeStampIsPast.pipe';
import { DeleteWhitespacesPipe } from './pipes/deleteWhitespaces.pipe';
import { WalletFirstNumPipe } from './pipes/walletImage.pipe';
import { ParseNumberPipe } from './pipes/parseNumber.pipe';
import { WalletSpeciePipe } from './pipes/walletSpecie';
import { NftContractToNamePipe } from './pipes/nftContractToName.pipe';
import { NftContractToVariablePipe } from './pipes/nftContractToVariable.pipe';
import { MaterialToTickerPipe } from './pipes/materialToTicker';
import { MaterialFromAddressPipe } from './pipes/materialFromAddress';
// General Components
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';
import { CommunityComponent } from './pages/community/community.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AllowanceManagerComponent } from './pages/allowance-manager/allowance-manager.component';
import { PopUpCustomAllowanceComponent } from './pages/allowance-manager/pop-up-custom-allowance/pop-up-custom-allowance.component';
// Shared Components
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CountdownComponent } from './shared/components/countdown/countdown.component';
import { SliderWebSectionsComponent } from './shared/components/slider-web-sections/slider-web-sections.component';
import { PopUpInfoComponent } from './shared/components/pop-ups/pop-up-info/pop-up-info.component';
import { MaterialViewerComponent } from './shared/components/material-viewer/material-viewer.component';
// NFT
import { NftComponent } from './pages/marketplace/nft/nft.component';
import { NftCardComponent } from './pages/marketplace/nft-card/nft-card.component';
import { ItemViewerSmallComponent } from './pages/marketplace/item-viewer-small/item-viewer-small.component';
import { ItemViewerMediumComponent } from './pages/marketplace/item-viewer-medium/item-viewer-medium.component';
import { ItemViewerBigComponent } from './pages/marketplace/item-viewer-big/item-viewer-big.component';
// Lootbox
import { LootboxHomeComponent } from './pages/lootbox/lootbox-home/lootbox-home.component';
import { LootboxCardComponent } from './pages/lootbox/lootbox-card/lootbox-card.component';
// PopUps
import { PopUpLootboxRewardsComponent } from './pages/lootbox/pop-up-lootbox-rewards/pop-up-lootbox-rewards.component';
import { PopUpLootboxUtilitiesComponent } from './pages/lootbox/pop-up-lootbox-utilities/pop-up-lootbox-utilities.component';
import { PopUpLootboxInfoComponent } from './pages/lootbox/pop-up-lootbox-info/pop-up-lootbox-info.component';
import { PopUpPutOnSaleComponent } from './pages/marketplace/pop-up-put-on-sale/pop-up-put-on-sale.component';
import { PopUpBuyAsGiftComponent } from './pages/marketplace/pop-up-buy-as-gift/pop-up-buy-as-gift.component';
import { PopUpBidOnAuctionComponent } from './pages/marketplace/pop-up-bid-on-auction/pop-up-bid-on-auction.component';
// Governance
import { GovernanceHomeComponent } from './pages/governance/governance-home/governance-home.component';
import { GovernanceAddProposalComponent } from './pages/governance/governance-add-proposal/governance-add-proposal.component';
import { GovernanceGetvpComponent } from './pages/governance/governance-getvp/governance-getvp.component';
import { GovernancePopUpBuyGqComponent } from './pages/governance/governance-pop-up-buy-gq/governance-pop-up-buy-gq.component';
import { GovernancePopUpGqAmountSelectorComponent } from './pages/governance/governance-pop-up-gq-amount-selector/governance-pop-up-gq-amount-selector.component';
import { GovernancePopUpVoteComponent } from './pages/governance/governance-pop-up-vote/governance-pop-up-vote.component';
import { GovernanceProposalCardComponent } from './pages/governance/governance-proposal-card/governance-proposal-card.component';
import { GovernanceProposalDetailComponent } from './pages/governance/governance-proposal-detail/governance-proposal-detail.component';
import { GovernanceProposalsComponent } from './pages/governance/governance-proposals/governance-proposals.component';
import { GovernanceStakeCardComponent } from './pages/governance/governance-stake-card/governance-stake-card.component';
// Profile
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileNftViewerComponent } from './pages/profile/profile-nft-viewer/profile-nft-viewer.component';
import { AchievementsComponent } from './pages/profile/achievements/achievements.component';
// Marketplace
import { MarketplaceHomeComponent } from './pages/marketplace/marketplace-home/marketplace-home.component';
import { DirectSellComponent } from './pages/marketplace/direct-sell/direct-sell.component';
import { AuctionsComponent } from './pages/marketplace/auctions/auctions.component';
// Policies
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './pages/legal/cookie-policy/cookie-policy.component';
import { LegalAdviceComponent } from './pages/legal/legal-advice/legal-advice.component';
// Partners Marketplace
import { PartnerSellComponent } from './pages/marketplace/partners/partner-sell/partner-sell.component';
import { PartnerItemViewerComponent } from './pages/marketplace/partners/partner-item-viewer/partner-item-viewer.component';
import { PartnerNftCardComponent } from './pages/marketplace/partners/partner-nft-card/partner-nft-card.component';
import { PartnerNftComponent } from './pages/marketplace/partners/partner-nft/partner-nft.component';
import { PartnerPopUpPutOnSaleComponent } from './pages/marketplace/partners/partner-pop-up-put-on-sale/partner-pop-up-put-on-sale.component';
import { PartnerPopUpBurnToReceiveComponent } from './pages/marketplace/partners/partner-pop-up-burn-to-receive/partner-pop-up-burn-to-receive.component';
import { PartnersHomeComponent } from './pages/marketplace/partners/partners-home/partners-home.component';
import { PartnerPopUpBaskoniaFaqComponent } from './pages/marketplace/partners/partner-pop-up-baskonia-faq/partner-pop-up-baskonia-faq.component';
// Crafting
import { CraftingHomeComponent } from './pages/crafting/crafting-home/crafting-home.component';
import { CraftingCardComponent } from './pages/crafting/crafting-card/crafting-card.component';
import { CraftingFactoryComponent } from './pages/crafting/crafting-factory/crafting-factory.component';
import { CraftingStep1CreationComponent } from './pages/crafting/crafting-card/crafting-step1-creation/crafting-step1-creation.component';
import { CraftingStep2StylingComponent } from './pages/crafting/crafting-card/crafting-step2-styling/crafting-step2-styling.component';
import { CraftingStep3AssemblyComponent } from './pages/crafting/crafting-card/crafting-step3-assembly/crafting-step3-assembly.component';
// Lands
import { LandsHomeComponent } from './pages/lands/lands-home/lands-home.component';
import { LandsMapComponent } from './pages/lands/lands-map/lands-map.component';
import { LandsItemViewerComponent } from './pages/lands/lands-item-viewer/lands-item-viewer.component';
import { LandsSelectorComponent } from './pages/lands/lands-selector/lands-selector.component';
import { LandsCardComponent } from './pages/lands/lands-card/lands-card.component';
import { PopUpBidOnlandsComponent } from './pages/lands/pop-up-bid-onlands/pop-up-bid-onlands.component';
import { LandsNeighboursComponent } from './pages/lands/lands-neighbours/lands-neighbours.component';
import { LandsDataComponent } from './pages/lands/lands-data/lands-data.component';
import { MaterialExtractionComponent } from './pages/lands/material-extraction/material-extraction.component';
import { MaterialExtractionCardComponent } from './pages/lands/material-extraction/material-extraction-card/material-extraction-card.component';
// Bridge
import { BridgeERC20SenderComponent } from './pages/bridge/bridge-erc20-sender/bridge-erc20-sender.component';
import { BridgeHomeComponent } from './pages/bridge/bridge-home/bridge-home.component';
import { BridgeToGameComponent } from './pages/bridge/bridge-to-game/bridge-to-game.component';
import { BridgeFromGameComponent } from './pages/bridge/bridge-from-game/bridge-from-game.component';
import { BridgeErc20ReceiverComponent } from './pages/bridge/bridge-erc20-receiver/bridge-erc20-receiver.component';
// Others
import { KeyringComponent } from './pages/profile/keyring/keyring.component';
import { PopUpSpecieSelectorComponent } from './shared/components/pop-ups/pop-up-specie-selector/pop-up-specie-selector.component';
import { PopUpConfirmationComponent } from './shared/components/pop-ups/pop-up-confirmation/pop-up-confirmation.component';
import { PipesModule } from './pipes/pipes.module';
import { SalesStatisticsComponent } from './pages/marketplace/sales-statistics/sales-statistics.component';
import { HealthComponent } from './pages/health/health.component';

// Factory function required during AOT compilation
export function httpTranslateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MarketplaceHomeComponent,
    NftComponent,
    ProfileComponent,
    CommunityComponent,
    PagesComponent,
    NftCardComponent,
    CountdownComponent,
    // FormatTimePipe,
    // CeilPipe,
    // DeleteWhitespacesPipe,
    // FloorPipe,
    // FromWeiPipe,
    // ToTickerPipe,
    // ShortWalletPipe,
    // TimeStampIsPastPipe,
    // WalletFirstNumPipe,
    // ParseNumberPipe,
    // WalletSpeciePipe,
    // FormatTimePipe,
    // CeilPipe,
    // DeleteWhitespacesPipe,
    // FloorPipe,
    // FromWeiPipe,
    // ToTickerPipe,
    // NftContractToNamePipe,
    // NftContractToVariablePipe,
    // ShortWalletPipe,
    // TimeStampIsPastPipe,
    // WalletFirstNumPipe,
    // ParseNumberPipe,
    // WalletSpeciePipe,
    // MaterialToTickerPipe,
    MaterialFromAddressPipe,
    LootboxCardComponent,
    PopUpLootboxRewardsComponent,
    PopUpLootboxUtilitiesComponent,
    PopUpLootboxInfoComponent,
    PopUpInfoComponent,
    ItemViewerSmallComponent,
    ItemViewerBigComponent,
    PopUpPutOnSaleComponent,
    PopUpBuyAsGiftComponent,
    PopUpBidOnAuctionComponent,
    ItemViewerMediumComponent,
    GovernanceAddProposalComponent,
    GovernanceGetvpComponent,
    GovernancePopUpBuyGqComponent,
    GovernancePopUpGqAmountSelectorComponent,
    GovernancePopUpVoteComponent,
    GovernanceProposalCardComponent,
    GovernanceProposalDetailComponent,
    GovernanceProposalsComponent,
    GovernanceStakeCardComponent,
    GovernanceHomeComponent,
    LootboxHomeComponent,
    MarketplaceHomeComponent,
    SliderWebSectionsComponent,
    DirectSellComponent,
    AuctionsComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    LegalAdviceComponent,
    PartnerSellComponent,
    PartnerItemViewerComponent,
    PartnerNftCardComponent,
    PartnerNftComponent,
	  MaterialViewerComponent,
    PartnerPopUpPutOnSaleComponent,
    PartnerPopUpBurnToReceiveComponent,
    PartnersHomeComponent,
    CraftingHomeComponent,
    LandsHomeComponent,
    LandsMapComponent,
    LandsItemViewerComponent,
    LandsSelectorComponent,
    LandsCardComponent,
    PopUpBidOnlandsComponent,
    LandsNeighboursComponent,
    FaqComponent,
    PartnerPopUpBaskoniaFaqComponent,
    LandsDataComponent,
    AllowanceManagerComponent,
    ProfileNftViewerComponent,
    BridgeERC20SenderComponent,
    PopUpCustomAllowanceComponent,
    AchievementsComponent,
    BridgeHomeComponent,
    BridgeToGameComponent,
    BridgeFromGameComponent,
    BridgeErc20ReceiverComponent,
    KeyringComponent,
    PopUpSpecieSelectorComponent,
    PopUpConfirmationComponent,
	SalesStatisticsComponent,
    CraftingCardComponent,
    CraftingFactoryComponent,
    CraftingStep1CreationComponent,
    CraftingStep2StylingComponent,
    CraftingStep3AssemblyComponent,
    MaterialExtractionComponent,
    MaterialExtractionCardComponent,
    HealthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    PipesModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    HttpClientJsonpModule,
    ApolloModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    MatFormFieldModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.graphURI
          })
        };
      },
      deps: [HttpLink]
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): any {
        return {
          governance: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURIgovernance
            })
          },
          marketplace: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURImarketplace
            })
          },
          crafting: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURIcrafting
            })
          },
          partners: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURIpartners
            })
          },
          lands: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURIlands
            })
          },
          pools: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.graphURIPools
            })
          }
        };
      },
      deps: [HttpLink]
    },
    DatePipe
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
