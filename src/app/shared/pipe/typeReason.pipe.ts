import { Pipe, type PipeTransform } from '@angular/core';
import { TypeReason } from '../enum/TypeReason.enum';


@Pipe({
    name: 'typeReasonPipe',
    standalone: true,
})
export class TypeReasonPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 1:
                return TypeReason.Pending;
            case 2:
                return TypeReason.Paid;
            case 3:
                return TypeReason.Finished;
            default:
                return '';
        }
    }
}
