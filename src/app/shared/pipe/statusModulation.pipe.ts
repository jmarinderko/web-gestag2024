import { Pipe, type PipeTransform } from '@angular/core';
import { StatusModulation } from '../enum/StatusModulation.enum';


@Pipe({
    name: 'statusModulation',
    standalone: true,
})
export class statusModulation implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 1:
                return StatusModulation.Pending;
            case 2:
                return StatusModulation.Complete;
            default:
                return '';
        }
    }
}
