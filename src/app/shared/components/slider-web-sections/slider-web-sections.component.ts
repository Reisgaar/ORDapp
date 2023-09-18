import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Auto playing slider
 */
@Component({
  selector: 'app-slider-web-sections',
  templateUrl: './slider-web-sections.component.html',
  styleUrls: ['./slider-web-sections.component.scss']
})
export class SliderWebSectionsComponent implements OnInit, OnDestroy {
  sliderCards = [0, 1, 2, 3];
  selectedCard = 0;
  posSlider1 = 0;
  posSlider2 = -500;
  opacitySlider1 = 1;
  opacitySlider2 = 1;
  sliderAvailable = true;
  fastClickinterval: any;
  autoPlayInterval: any;
  movingInitPosition: number;


  constructor(
    private router: Router
  ) {
    this.posSlider2 = (-100 * this.sliderCards.length) - 100;
  }

  /**
   * Sets the autoplay
   */
  ngOnInit(): void {
    this.setAutoplay();
  }

  /**
   * Clears the autoplay interval
   */
  ngOnDestroy(): void {
    clearInterval(this.autoPlayInterval);
  }

  /**
   * Sets the autoplay interval to 5s
   */
  setAutoplay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.moveSlider(false);
    }, 5000);
  }

  /**
   * Moves slider and resets autoplay
   * @param {boolean} toLeft : true to move to the left, false to right
   */
  clickToMoveSlider(toLeft: boolean): void {
    if (this.sliderAvailable) {
      clearInterval(this.autoPlayInterval);
      this.moveSlider(toLeft);
      this.setAutoplay();
    }
  }

  /**
   * Moves slider one step
   * @param {boolean} toLeft : true to move to the left, false to right
   */
  moveSlider(toLeft: boolean): void {
    if (this.sliderAvailable) {
      // control opacity on movement
      this.opacitySlider1 = 1;
      this.opacitySlider2 = 1;
      // Set movement
      this.controlFastClick();
      let movement = 100;
      if (toLeft) { movement = movement * -1; }
      // Move Slider
      this.posSlider1 = this.posSlider1 - movement;
      this.posSlider2 = this.posSlider2 - movement;
      this.changeSelectedCard(toLeft);
      this.setAuxiliarSlider(toLeft, movement);
    }
  }

  /**
   * Changes the selected card
   * @param {boolean} toLeft : true to move to the left, false to right
   */
  changeSelectedCard(toLeft: boolean): void {
    if (toLeft) {
      this.selectedCard--;
    } else {
      this.selectedCard++;
    }

    if (this.selectedCard < 0) {
      this.selectedCard = this.sliderCards.length - 1;
    } else if (this.selectedCard > this.sliderCards.length - 1) {
      this.selectedCard = 0;
    }
  }

  /**
   * Sets the auxiliar slider
   * @param {boolean} toLeft : true to move to the left, false to right
   * @param {number} movement : the total of the movement
   */
  setAuxiliarSlider(toLeft: boolean, movement: number): void {
    // Slider 1 main
    if (toLeft && this.posSlider1 - movement === 100){
      this.opacitySlider2 = 0;
      this.posSlider2 = (this.sliderCards.length * -100) - 100;
    }
    if (!toLeft && this.posSlider1 - movement === (this.sliderCards.length * -100)){
      this.opacitySlider2 = 0;
      this.posSlider2 = 0;
    }
    // Slider 2 main
    if (toLeft && this.posSlider2 - movement === 0){
      this.opacitySlider1 = 0;
      this.posSlider1 = (this.sliderCards.length * -100);
    }
    if (!toLeft && this.posSlider2 - movement === (this.sliderCards.length * -100) - 100){
      this.opacitySlider1 = 0;
      this.posSlider1 = 100;
    }
  }

  /**
   * Sets the opacity to hide auxiliar slider movement
   * @param {number} num : selected card number
   */
  setSliderVisibleCard(num: number): void {
    clearInterval(this.autoPlayInterval);
    this.opacitySlider1 = 1;
    this.opacitySlider2 = 1;
    this.selectedCard = num;
    // If slider 1 visible
    if (this.posSlider1 <= 0 && this.posSlider1 >= ((this.sliderCards.length * -100) + 100)) {
      this.posSlider1 = num * -100;
      this.opacitySlider2 = 0;
      if (this.posSlider1 === 0) {
        this.posSlider2 = (this.sliderCards.length * -100) - 100;
      } else if (this.posSlider1 === ((this.sliderCards.length * -100) + 100)) {
        this.posSlider2 = 0;
      } else {
        this.posSlider2 = (-100 * this.sliderCards.length) - 100;
      }
    }
    // If slider 2 visible
    else {
      this.posSlider2 = (num * -100) - 100;
      this.opacitySlider1 = 0;
      if (this.posSlider2 === -100) {
        this.posSlider1 = this.sliderCards.length * -100;
      } else if (this.posSlider2 === (this.sliderCards.length * -100)) {
        this.posSlider1 = 100;
      } else {
        this.posSlider1 = (-100 * this.sliderCards.length) - 100;
      }
    }
    this.setAutoplay();
  }

  /**
   * Avoid the fast click on slider to prevent errors
   */
  controlFastClick(): void {
    this.sliderAvailable = false;
    this.fastClickinterval = setInterval(() => {
      this.sliderAvailable = true;
      clearInterval(this.fastClickinterval);
    }, 600);
  }

  /**
   * Navigates to the indicated url
   * @param url : to navigate to
   * @param local : if is local (true) or external (false) navigation
   */
  navigateTo(url: string, local: boolean): void {
    if (local) {
      this.router.navigate([url]);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * When mousedown gets the actual position of the cursor
   * @param {any} e : event that triggers the function
   * @param {number} position : actual cursor position
   */
  mouseStartSlider(e: any, position: number): void {
    e.preventDefault();
    this.movingInitPosition = position;
  }

  /**
   * When mouseup gets the actual position, if movement is <50px, moves the slider and restarts the autoplay
   * @param {number} position : actual position
   */
  mouseStopSlider(position: number): void {
    clearInterval(this.autoPlayInterval);
    if (this.movingInitPosition + 50 < position) { this.moveSlider(true); }
    else if (this.movingInitPosition - 50 > position) { this.moveSlider(false); }
    this.setAutoplay();
  }

}
