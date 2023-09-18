import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to check if a timestamp has passed
 */
@Pipe({name: 'timeStampIsPast'})
export class TimeStampIsPastPipe implements PipeTransform {

  /**
   * Checks if received timestamp has passed
   * @param value timestamp to check
   * @returns true if has passed
   */
  transform(value: string): boolean {
    let isPast = true;
    const data = parseInt(value, 0);
    const now = Date.now() / 1000;
    if (data < now) {
      isPast = false;
    }
    return isPast;
  }
}
