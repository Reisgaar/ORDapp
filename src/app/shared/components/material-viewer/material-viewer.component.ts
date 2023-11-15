import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { minerals } from 'src/app/constants/craftingData';
import { getWalletMaterials } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

/**
 * Component to show user materials
 */
@Component({
  selector: 'app-material-viewer',
  templateUrl: './material-viewer.component.html',
  styleUrls: ['./material-viewer.component.scss']
})
export class MaterialViewerComponent implements OnInit, OnDestroy {
  @Input() color: string;
  materials: Array<any> = minerals;
  windowSize: number = 0;
  shownMaterials: Array<any>;
  movementAvailable: boolean = false;
  sliderInterval: any;
  materialsQuery: any;
  querySubscription: any;
  walletInterval: any;

  constructor(
    private connectionService: ConnectionService,
    private apollo: Apollo
  ) {
    this.windowSize = window.innerWidth;
  }

  /**
   * Change slider on resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.windowSize = window.innerWidth;
    this.setShownMaterials();
  }

  /**
   * Sets the materials and gets wallet
   */
  ngOnInit(): void {
    this.setShownMaterials();
    this.walletInterval = setInterval( async () => {
      try {
        const userAddress = this.connectionService.getWalletAddress().toLowerCase();
        this.getWalletMaterials(userAddress);
        clearInterval(this.walletInterval);
      } catch (error: any) { }
    }, 1000);
  }

  /**
   * Ends intervals if exist
   */
  ngOnDestroy(): void {
    if (this.sliderInterval) {clearInterval(this.sliderInterval); }
    if (this.walletInterval) { clearInterval(this.walletInterval); }
    if (this.querySubscription) { this.querySubscription.unsubscribe(); }
  }

  /**
   * Subscribes to query to get user materials
   * @param {string} userAddress : Address of the user wallet
   */
  async getWalletMaterials(userAddress: string): Promise<any> {
    this.materialsQuery = this.apollo.use('crafting').watchQuery({
      query: getWalletMaterials,
      pollInterval: 5000,
      variables: {
        wallet: userAddress
      }
    });
    this.querySubscription = this.materialsQuery
      .valueChanges
      .subscribe( async (data: any) => {
        console.log('Materials Query:');
        console.log(data);
        let response = data.data.usersMaterials[0];
        this.addValuesToArray(response);
      });
  }

  /**
   * Manage the data obtained from the materials query
   * @param data : Result of materials query
   */
  addValuesToArray(data: any): void {
    for (let mat of this.materials) {
      if (data) {
        mat.amount = data[mat.name.toLowerCase()];
      } else {
        mat.amount = '0';
      }
    }
    console.log(this.materials);
    this.movementAvailable = true;
    if (!this.sliderInterval) {
      this.startSlider();
    }
  }

  /**
   * Starts slider automatic movement
   */
  startSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.moveSlider(true);
    }, 3000);
  }

  /**
   * Ends slider interval
   */
  endSliderInterval(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  /**
   * Set shown material amoun according to window width
   */
  setShownMaterials(): void {
    let width = this.windowSize;
    if (innerWidth > 1260) {
      width = 1260;
    } else if (innerWidth < 320) {
      width = 320;
    }
    const size = Math.floor((width - 60) / 120);
    this.shownMaterials = this.materials.slice(0, size);
  }

  /**
   * Moves slider one step
   * @param {boolean} isNext : True if movement is next, false if is previous
   */
  moveSlider(isNext: boolean): void {
    this.endSliderInterval();
    if (isNext) {
      const firstItem = this.materials[0];
      this.materials.shift();
      this.materials.push(firstItem);
    } else {
      const firstItem = this.materials[this.materials.length - 1];
      this.materials.pop();
      this.materials.unshift(firstItem);
    }
    this.startSlider();
    this.setShownMaterials();
  }

}
