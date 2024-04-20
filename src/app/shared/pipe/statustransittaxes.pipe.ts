import { Pipe, type PipeTransform } from '@angular/core';
import { StatusTransitTaxes } from '../enum/StatusTransitTaxes.enum';


@Pipe({
  name: 'StatustransittaxesPipe',
  standalone: true,
})
export class StatustransittaxesPipe implements PipeTransform {

    transform(value: number): string {
        switch (value) {
            case 1:
                return StatusTransitTaxes.PendingMun;
            case 2:
                return StatusTransitTaxes.PaidMun;
            case 3:
                return StatusTransitTaxes.PendingJuz;
            case 4:
                return StatusTransitTaxes.PaidJuz;
            case 5:
                return StatusTransitTaxes.Acquitted;
            case 6:
                return StatusTransitTaxes.FailedRMNP;
            default:
                return '';
        }
    }
}
