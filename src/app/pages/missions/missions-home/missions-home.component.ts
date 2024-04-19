import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-missions-home',
  templateUrl: './missions-home.component.html',
  styleUrls: ['./missions-home.component.scss']
})
export class MissionsHomeComponent implements OnInit {
  areas: string[] = ['recruitment', 'armory', 'garage', 'warehouse', 'restingArea', 'bank', 'missionsSelection'];
  actualArea: number = 0;
  interval: any;

  /**
   * Sets interval to change selected area every 5s
   */
  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.toNextArea();
    }, 5000);
  }

  /**
   * Changes selected area to next one
   */
  toNextArea(): void {
    const move = this.actualArea + 1;
    this.actualArea = move < 0 ? (this.areas.length - 1) : move >= this.areas.length ? 0 : move;
  }

  /**
   * Changes selected area to given one
   * @param area area to change to
   */
  goToArea(area: number): void {
    this.actualArea = area;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.toNextArea();
    }, 5000);
  }
}
