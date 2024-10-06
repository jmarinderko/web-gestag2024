import { Pipe, type PipeTransform } from '@angular/core';
import { TypeLocation } from '../enum/TypeLocation.enum';


@Pipe({
    name: 'typeLocation',
    standalone: true,
})
export class TypeLocationPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 3:
                return TypeLocation.Mun;
            case 4:
                return TypeLocation.Jpl;
            case 6:
                return TypeLocation.RMNTP;
            default:
                return '';
        }
    }
}
