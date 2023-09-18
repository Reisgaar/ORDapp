import { Component, Input, OnChanges, OnInit } from '@angular/core';

/**
 * Item viewer for marketplace NFTs
 */
@Component({
  selector: 'app-item-viewer-medium',
  templateUrl: './item-viewer-medium.component.html',
  styleUrls: ['./item-viewer-medium.component.scss']
})
export class ItemViewerMediumComponent implements OnInit, OnChanges {
  @Input() items: any[];
  @Input() category: string;

  // Pagination
  pagItemPerPage: number = 8;
  pagActualPage: number = 0;
  pagTotalPages: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.setPagination();
  }

  /**
   * Controls changes on data array
   */
  async ngOnChanges(): Promise<any> {
    this.setPagination();
  }

  /**
   * Set the total page amount
   */
  setPagination(): void {
    this.pagTotalPages = Math.ceil(this.items.length / this.pagItemPerPage) - 1;
    this.goToFirstOrLastPage(true);
  }

  /**
   * Changes the page on the pagination
   * @param isNext true for next, false for previous
   */
  changePage(isNext: boolean): void {
    let movement = 1;
    if (!isNext) { movement = -1; }
    this.pagActualPage += movement;
  }

  /**
   * Go to first or last page on pagination
   * @param toFirst true to first, false to last
   */
  goToFirstOrLastPage(toFirst: boolean): void {
    if (toFirst) {
      this.pagActualPage = 0;
    } else {
      this.pagActualPage = this.pagTotalPages;
    }
  }

}
