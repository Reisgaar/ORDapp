import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { timer, Subscription } from 'rxjs';

/**
 * Countdown component with only time, no style
 */
@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() end: number;
  countDown: any;
  counter: number;
  countdownEnded: boolean = false;
  @Output() countdownEndedEvent = new EventEmitter<boolean>();
  counterRefresh: any;

  constructor() {
  }

  /**
   * Sets the countdown
   */
  ngOnInit(): void {
    let endTime = this.end;
    if (typeof endTime === 'string') {
      endTime = parseInt(endTime);
    }
    this.counter = endTime - (Math.floor(Date.now() / 1000));
    // Decrease countdown every 1s
    this.countDown = timer(0, 1000).subscribe(() => {
      if ((this.counter - 1) > 0) {
        --this.counter;
      } else {
        --this.counter;
        this.countdownEnded = true;
        this.sendData();
        if (this.countDown) {
          this.countDown.unsubscribe();
          clearInterval(this.counterRefresh);
        }
      }
    });
    // Check if counter is correct every 30s
    this.counterRefresh = setInterval(() => {
      this.checkCounter();
    }, 30000);
  }

  /**
   * Sets countdown to null
   */
  ngOnDestroy(): void {
    this.countDown = null;
    if (this.counterRefresh) {
      clearInterval(this.counterRefresh);
    }
  }

  /**
   * Emit event to inform parent component that auction has ended
   */
  sendData(): void {
    this.countdownEndedEvent.emit(this.countdownEnded);
  }

  /**
   * Check counter to avoid time diference error
   */
  checkCounter(): void {
    let endTime = this.end;
    if (typeof endTime === 'string') {
      endTime = parseInt(endTime);
    }
    this.counter = endTime - (Math.floor(Date.now() / 1000));
  }

}
