import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to change timestamp to remaining time
 */
@Pipe({name: 'formatTime'})
export class FormatTimePipe implements PipeTransform {

  /**
   * Transforms a timestamp to remaining time
   * @param {number} value : timestamp to convert
   * @returns {Array} : with the data to show
   */
  transform(value: number): Array<any> {
    if (value >= 129600) {
      const days = Math.round(value / 60 / 60 / 24);
      return [days, 'countdown.daysLeft'];
    } else if (value >= 86400) {
      const days = Math.floor(value / 60 / 60 / 24);
      return [days, 'countdown.dayLeft'];
    } else if (value < 1) {
      return ['', 'countdown.ended'];
    } else {
      return [new Date(value * 1000).toISOString().substring(11, 19), ''];
    }
  }
}
