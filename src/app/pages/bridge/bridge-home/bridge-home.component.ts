import { Component } from '@angular/core';

@Component({
  selector: 'app-bridge-home',
  templateUrl: './bridge-home.component.html',
  styleUrls: ['./bridge-home.component.scss']
})
export class BridgeHomeComponent {
  selectedTab: string = 'toGame';

  changeTab(newTab: string): void {
    this.selectedTab = newTab;
  }
}
