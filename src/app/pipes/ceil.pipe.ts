import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to ceil numbers
 */
@Pipe({name: 'ceil'})
export class CeilPipe implements PipeTransform {

    /**
     * Rounds a number to ceil
     * @param {number} value : the value to ceil
     * @returns {number} : rounded number
     */
    transform(value: number): number {
        return Math.ceil(value);
    }
}
