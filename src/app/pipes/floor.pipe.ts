import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to round numbers
 */
@Pipe({name: 'floor'})
export class FloorPipe implements PipeTransform {

    /**
     * Rounds a number to floor
     * @param {number} value : the value to floor
     * @returns {number} : rounded number
     */
    transform(value: number): number {
        return Math.floor(value);
    }
}
