import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Main component with map and lands list
 */
@Component({
  selector: 'app-lands-selector',
  templateUrl: './lands-selector.component.html',
  styleUrls: ['./lands-selector.component.scss']
})
export class LandsSelectorComponent implements OnInit {
  display: string = 'card';
  clickFilter: Subject<any> = new Subject();
  sortingName: string = '';
  sortingDirection: string = '';
  showAuctions: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Changes the display type between list or card type
   * @param displayType 'card' or 'list'
   */
  setDisplayTo(displayType: string): void {
    this.display = displayType;
  }

  /**
   * Notifies when sorting button changes
   */
  notifyClickFilter(): void {
    this.clickFilter.next(null);
  }

  /**
   * Receive sorting data from child
   * @param $event event emitted by the child
   */
  receiveSortingData($event: any): void {
    this.sortingName = $event.order;
    this.sortingDirection = $event.direction;
  }

  /**
   * Changes between lands auction list and neighbour list
   * @param toAuctions true to show auctions, false to show neighbours
   */
  switchViewer(toAuctions: boolean): void {
    this.showAuctions = toAuctions;
  }

}
