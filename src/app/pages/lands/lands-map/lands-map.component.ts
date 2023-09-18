import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FilterService } from 'src/app/shared/services/filter.service';

/**
 * The map where user can select the zone to buy a land
 */
@Component({
  selector: 'app-lands-map',
  templateUrl: './lands-map.component.html',
  styleUrls: ['./lands-map.component.scss']
})
export class LandsMapComponent implements OnInit, AfterViewInit {
  previewedData = { ring: '', sector: '', district: '' };
  selectedData = { ring: '', sector: '', district: '' };
  hoveredRing: string = '';
  mouseOverContainer: any;
  ex1Layer: any;
  selectedSizes: any = { nano: true, micro: true, standard: true, macro: true, mega: true };

  constructor(
    private filterService: FilterService
    ) { }

  ngOnInit(): void {
  }

  /**
   * Get elements to control the map rotation
   */
  ngAfterViewInit(): void {
    this.mouseOverContainer = document.getElementById('wrapper');
    this.ex1Layer = document.getElementById('map');
  }

  /**
   * Emits event when data changes
   */
  sendFilterData(): void {
    this.filterService.landFilterChanges(this.selectedData, this.selectedSizes);
  }

  /*
   * Calculates the position of the 3d perspective
   */
  transforms(x: any, y: any, el: any): any {
    const aaa = 100;
    const box = el.getBoundingClientRect();
    const calcX = (y - box.y - (box.height / 2)) / aaa;
    const calcY = -(x - box.x - (box.width / 2)) / aaa;

    return 'perspective(100px) '
      + '   rotateX(' + calcX + 'deg) '
      + '   rotateY(' + calcY + 'deg) ';
  }

  /**
   * Applies the transforms to the element
   * @param el the element
   * @param xyEl the transformation
   */
  transformElement(el: any, xyEl: any): any {
    el.style.transform  = this.transforms.apply(null, xyEl);
  }

  /**
   * Controls the following to the cursor
   * @param e mouse event
   */
  following(e: any): any {
    const xy = [e.clientX, e.clientY];
    const position = xy.concat([this.ex1Layer]);

    window.requestAnimationFrame( () => {
      this.transformElement(this.ex1Layer, position);
    });
  }

  /*
   * Shows the previewed data when mouse is over a sector
   */
  previewSector(ring: string, sector: string, isEnter: boolean): void {
    this.previewedData.ring = ring;
    this.previewedData.sector = sector;
    if (isEnter) { this.hoveredRing = ring; }
    else { this.hoveredRing = ''; }
  }

  /**
   * When user selects a sector, stores the data
   * @param ring selected ring
   * @param sector selected sector
   */
  selectSector(ring: string, sector: string): void {
    if (ring !== '-1') {
      this.selectedData.ring = ring;
    }
    this.selectedData.sector = sector;
    this.sendFilterData();
  }

  /*
   * Shows the previewed data when mouse is over a district
   */
  previewDistrict(district: string): void {
    this.previewedData.district = district;
  }

  /**
   * When user selects a district, stores the data
   * @param district selected district
   */
  selectDistrict(district: string): void {
    this.selectedData.district = district;
    this.sendFilterData();
  }

  /**
   * Resets all the selections done by the user
   */
  closeSelection(): void {
    this.selectedData.ring = '';
    this.selectedData.sector = '';
    this.selectedData.district = '';
    this.sendFilterData();
  }

  /**
   * Manage the filters of the land sizes
   * @param size the name of the selected size
   * @param isActive the value to switch to
   */
  filterLandsSize(size: string, isActive: boolean): void {
    this.selectedSizes[size] = isActive;
    this.sendFilterData();
  }

}
