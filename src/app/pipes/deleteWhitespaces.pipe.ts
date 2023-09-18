import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to delete all whitespaces
 */
@Pipe({name: 'deleteWhitespaces'})
export class DeleteWhitespacesPipe implements PipeTransform {
    /**
     * Deletes all whitespaces from received string
     * @param value string to process
     * @returns processed string
     */
    transform(value: string): string {
        return value.replace(/ /g, '');
    }
}
