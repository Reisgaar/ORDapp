import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

/**
 * Item viewer for marketplace NFTs
 */
@Component({
  selector: 'app-item-viewer-small',
  templateUrl: './item-viewer-small.component.html',
  styleUrls: ['./item-viewer-small.component.scss']
})
export class ItemViewerSmallComponent implements OnInit, OnChanges {
  @Input() items: any[];
  @Input() category: string;
  @Input() switcherActive: boolean;
  viewerOpened: boolean = true;

  // Pagination
  pagItemPerPage: number = 4;
  pagActualPage: number = 0;
  pagTotalPages: number = 1;

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 992) {
      this.pagItemPerPage = 4;
    } else if (window.innerWidth > 768) {
      this.pagItemPerPage = 3;
    } else if (window.innerWidth > 576) {
      this.pagItemPerPage = 2;
    } else {
      this.pagItemPerPage = 1;
    }
    this.setPagination();
  }

  constructor() {}

  ngOnInit(): void {
    this.setPagination();
  }

  /**
   * Controls changes on data array
   */
  async ngOnChanges(changes: SimpleChanges): Promise<any> {
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

  /**
   * Close and open viewer
   */
  switchViewer(): void {
    this.viewerOpened = !this.viewerOpened;
  }

}
