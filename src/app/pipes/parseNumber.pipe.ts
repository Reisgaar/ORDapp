import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to parseNumber numbers
 */
@Pipe({name: 'parseNumber'})
export class ParseNumberPipe implements PipeTransform {

    /**
     * Parse a string and returns a number
     * @param {string} value : the string to parse
     * @returns {number} : parsed number
     */
    transform(value: string): number {
      try {
        return parseFloat(value);
      } catch (error) {
        console.log(error);
      }
    }
}
