import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to change seconds to 'Xd Xh Xm Xs'
 */
@Pipe({name: 'timeToDhms'})
export class TimeToDhmsPipe implements PipeTransform {

  /**
   * Transforms seconds to remaining time as 'Xd Xh Xm Xs'
   * @param {number} value : seconds to convert
   * @returns {string} : with the data to show
   */
  transform(value: number): string {
    console.log(value)
    const days = Math.floor(value / 60 / 60 / 24);
    const daysInSeconds = days * 24 * 60 * 60;
    const hours = Math.floor( (value - daysInSeconds) / 60 / 60);
    const hoursInSeconds = hours * 60 * 60;
    const minutes = Math.floor( (value - daysInSeconds - hoursInSeconds) / 60);
    const minutesInSeconds = minutes * 60;
    const seconds = value - daysInSeconds - hoursInSeconds - minutesInSeconds;
    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
  }
}
