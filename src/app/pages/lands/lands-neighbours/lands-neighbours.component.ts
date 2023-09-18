import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { getAllLands } from 'src/app/constants/gqlQueries';
import { FilterService } from 'src/app/shared/services/filter.service';
import { neighboursPartnersLogos } from 'src/app/constants/lands';
import { Router } from '@angular/router';
import { contractAddresses } from 'src/app/constants/contractAddresses';

/**
 * Component to show owners of lands on the selected zone
 */
@Component({
  selector: 'app-lands-neighbours',
  templateUrl: './lands-neighbours.component.html',
  styleUrls: ['./lands-neighbours.component.scss']
})
export class LandsNeighboursComponent implements OnInit, OnDestroy {
  landFiltersSubscription: Subscription;
  zone: { ring: '', sector: '', district: ''};
  landsQuery: any;
  landsQuerySubscription: any;
  neighbourList: any;
  loadingNeighbours: boolean = true;

  constructor(
    private filterService: FilterService,
    private router: Router,
    private apollo: Apollo
  ) { }

  /**
   * Subscribes to the filter changes
   */
  ngOnInit(): void {
    // Subscribe to filter changes
    this.landFiltersSubscription = this.filterService.landFilters$.subscribe( (res: any) => {
      this.zone = res.zone;
      console.log(this.zone);
      this.getLandsOnSector();
    });
  }

  /**
   * Unsubscribe from subscriptions
   */
  ngOnDestroy(): void {
    if (this.landsQuerySubscription) { this.landsQuerySubscription.unsubscribe(); }
    if (this.landFiltersSubscription) { this.landFiltersSubscription.unsubscribe(); }
  }

  /**
   * Get all the lands of selected zone
   */
  async getLandsOnSector(): Promise<any> {
    // Unsubscribe is neccesary to work with filters. Using refetch() didn't work, always returns cached result
    if (this.landsQuerySubscription) {
      this.landsQuerySubscription.unsubscribe();
    }
    this.landsQuery = this.apollo.use('lands').watchQuery({
      query: getAllLands,
      pollInterval: 5000,
      variables: {
        ring: this.zone.ring,
        sector: this.zone.sector,
        district: this.zone.district
      }
    });
    this.landsQuerySubscription = this.landsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        this.loadingNeighbours = false;
        console.log('Neighbour on selected lands Query:');
        this.neighbourList = res.data.lands;
        console.log(this.neighbourList);
        this.setPartnersImages();
      });
  }

  /**
   * Gets the ring on string
   * @param data ring name from metadata
   * @returns string with ring number
   */
  getRingString(data: number): string {
    switch (data) {
      case 0: return '';
      case 1: return '1';
      case 2: return '2';
      case 3: return '3';
      case 4: return '4';
      default: return '';
    }
  }

  /**
   * Set the image of a partner from constant data
   */
  setPartnersImages(): void {
    let neighbourListWithPartnersImage: any[] = [];
    for (const neighbour of this.neighbourList) {
      const image: any = Object.keys(neighboursPartnersLogos).find((item: any) => item.toLowerCase() === neighbour.currentOwner.toLowerCase());
      const neighbourWithImage = { ...neighbour, image: neighboursPartnersLogos[image] };
      neighbourListWithPartnersImage.push(neighbourWithImage);
    }
    this.neighbourList = [];
    this.neighbourList = neighbourListWithPartnersImage;
    console.log(this.neighbourList);
  }

  /**
   * Prevents scroll on mousedown
   * @param {any} event : event of mousedown
   */
  preventScroll(event: any): void {
    if (event.button === 1) {
      event.preventDefault();
    }
  }

  /**
   * Opens detail of the NFT on click
   */
  async clickToDetail(tokenId: any): Promise<void> {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: contractAddresses.land, id: tokenId}})
    );
    window.open(url, '_blank');
  }

  /**
   * Opens detail of the NFT on a new tab on wheel click
   */
  async wheelToDetail(event: any, tokenId: any): Promise<void> {
    event.preventDefault();
    if (event.button === 1) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/marketplace/nft'], {queryParams: {nftContractAddress: contractAddresses.land, id: tokenId}})
      );
      window.open(url, '_blank');
    }
  }
}
