import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionService } from '../shared/services/connection/connection.service';

/**
 * Pipe to transform a wei number to ether
 */
@Pipe({name: 'fromWei'})
export class FromWeiPipe implements PipeTransform {

    constructor(private connectionService: ConnectionService) {}

    /**
     * Transforms the wei to number
     * @param {number | string} value : the number to transform
     * @returns {string} : the transformed number
     */
    transform(value: number | string): any {
      if (typeof value !== 'string') {
        value = value.toLocaleString('en', {useGrouping: false} );
        // value = value.toString();
      }
      return this.connectionService.fromWei(value);
    }
}
