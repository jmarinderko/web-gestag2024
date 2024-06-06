import { Pipe, type PipeTransform } from '@angular/core';
import { StatusProcess } from '../enum/StatusProcess.enum';


@Pipe({
  name: 'StatusprocessPipe',
  standalone: true,
})
export class StatusprocessPipe implements PipeTransform {

    transform(value: number): string {
        switch (value) {
            case 0:
                return StatusProcess.Pending;
            case 1:
                return StatusProcess.Process;
            case 2:
                return StatusProcess.complete;
            default:
                return '';
        }
    }
}
