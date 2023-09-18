import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { GovernanceAddProposalComponent } from './governance/governance-add-proposal/governance-add-proposal.component';
import { GovernanceGetvpComponent } from './governance/governance-getvp/governance-getvp.component';
import { GovernanceProposalDetailComponent } from './governance/governance-proposal-detail/governance-proposal-detail.component';
import { GovernanceProposalsComponent } from './governance/governance-proposals/governance-proposals.component';
import { HomeComponent } from './home/home.component';
import { NftComponent } from './marketplace/nft/nft.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { GovernanceHomeComponent } from './governance/governance-home/governance-home.component';
import { LootboxHomeComponent } from './lootbox/lootbox-home/lootbox-home.component';
import { MarketplaceHomeComponent } from './marketplace/marketplace-home/marketplace-home.component';
import { DirectSellComponent } from './marketplace/direct-sell/direct-sell.component';
import { AuctionsComponent } from './marketplace/auctions/auctions.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './legal/cookie-policy/cookie-policy.component';
import { LegalAdviceComponent } from './legal/legal-advice/legal-advice.component';
import { PartnerSellComponent } from './marketplace/partners/partner-sell/partner-sell.component';
import { PartnerNftComponent } from './marketplace/partners/partner-nft/partner-nft.component';
import { PartnersHomeComponent } from './marketplace/partners/partners-home/partners-home.component';
import { LandsHomeComponent } from './lands/lands-home/lands-home.component';
import { LandsSelectorComponent } from './lands/lands-selector/lands-selector.component';
import { FaqComponent } from './faq/faq.component';
import { AllowanceManagerComponent } from './allowance-manager/allowance-manager.component';
import { SalesStatisticsComponent } from './marketplace/sales-statistics/sales-statistics.component';
import { CraftingHomeComponent } from './crafting/crafting-home/crafting-home.component';
import { CraftingFactoryComponent } from './crafting/crafting-factory/crafting-factory.component';
import { HealthComponent } from './health/health.component';
import { MaterialExtractionComponent } from './lands/material-extraction/material-extraction.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      // PROFILE
      {
        path: 'profile',
        component: ProfileComponent
      },
      // MARKETPLACE
      {
        path: 'marketplace',
        component: MarketplaceHomeComponent
      },
      {
        path: 'marketplace/statistics',
        component: SalesStatisticsComponent
      },
      {
        path: 'marketplace/directSales',
        component: DirectSellComponent
      },
      {
        path: 'marketplace/auctions',
        component: AuctionsComponent
      },
      {
        path: 'marketplace/nft',
        component: NftComponent
      },
      {
        path: 'marketplace/partners',
        component: PartnersHomeComponent
      },
      {
        path: 'marketplace/partner',
        component: PartnerSellComponent
      },
      {
        path: 'marketplace/partner/nft',
        component: PartnerNftComponent
      },
      // GOVERNACE
      {
        path: 'governance',
        component: GovernanceHomeComponent,
      },
      {
        path: 'governance/proposals',
        component: GovernanceProposalsComponent
      },
      {
        path: 'governance/proposalDetails',
        component: GovernanceProposalDetailComponent
      },
      {
        path: 'governance/getVotingPower',
        component: GovernanceGetvpComponent
      },
      {
        path: 'governance/leaveProposal',
        component: GovernanceAddProposalComponent
      },
      // LOOTBOXES
      {
        path: 'lootboxes',
        component: LootboxHomeComponent
      },
      // LANDS
      {
        path: 'lands',
        component: LandsHomeComponent
      },
      {
        path: 'lands/map',
        component: LandsSelectorComponent
      },
      {
        path: 'lands/materialExtraction',
        component: MaterialExtractionComponent
      },
      // CRAFTING
      {
        path: 'crafting',
        component: CraftingHomeComponent
      },
      {
        path: 'crafting/factory',
        component: CraftingFactoryComponent
      },
      // OTHERS
      {
        path: 'allowanceManager',
        component: AllowanceManagerComponent
      },
      {
        path: 'cookiePolicy',
        component: CookiePolicyComponent
      },
      {
        path: 'privacyPolicy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'legalNotice',
        component: LegalAdviceComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: '_health',
        component: HealthComponent
      }
    ]
  },
  {
    path: 'defi',
    loadChildren: () =>
      import('./defi/defi.module').then((m) => m.DefiModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }