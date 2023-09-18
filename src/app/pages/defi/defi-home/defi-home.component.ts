import { Component, HostListener } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-defi-home',
  templateUrl: './defi-home.component.html',
  styleUrls: ['../defi.component.scss']
})
export class DefiHomeComponent {
  imgRotationDeg: number = 0;

  constructor(
    private dialogService: DialogService
  ) { }

  /**
   * Triggers when scroll
   */
  // @HostListener('window:scroll', ['$event']) // for window scroll events
  // onScroll(): void {
  //   this.moveImageOnScroll();
  // }

  ngOnInit(): void {
  }

  openDefiPopUp(link): void {
    this.dialogService.openDefiDialog(link)
  }

  /**
   * Moves the image when scrolling
   */
  // moveImageOnScroll(): void {
    // // Get neccesary values
    // const rings = document.getElementById('rotatingRings');
    // const positionOnViewport = rings.getBoundingClientRect().top;
    // const elementHeight = rings.offsetHeight;
    // const windowHeight = window.innerHeight;
    // // Get animation percentage
    // const percentage = (positionOnViewport + elementHeight) * 100 / (windowHeight + elementHeight);
    // console.log('per: ', percentage);
    // // get amount of rotation
    // const rotation = percentage * 25 / 100;
    // console.log('rot: ', rotation);
    // // Appply between 0 and 25
    // if (rotation < 0 ) {
    //   this.imgRotationDeg = 0;
    // } else if (rotation > 25) {
    //   this.imgRotationDeg = 25;
    // } else {
    //   this.imgRotationDeg = rotation;
    // }
  // }
}
