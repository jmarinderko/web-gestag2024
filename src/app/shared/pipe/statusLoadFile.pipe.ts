import { Pipe, type PipeTransform } from '@angular/core';
import { StatusLoadFile } from '../enum/StatusLoadFile.enum';

@Pipe({
    name: 'statusloadfilepipe',
    standalone: true,
})
export class StatusLoadFilePipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0:
                return StatusLoadFile.ErrorLoad;
            case 1:
                return StatusLoadFile.LoadWait;
            case 2:
                return StatusLoadFile.Load;
            case 3:
                return StatusLoadFile.LoadHold;
            default:
                return '';
        }
    }
}
