import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyCl',
    standalone: true,
})
export class CurrencyClPipe implements PipeTransform {
    transform(value: number): string {
        // Formatear el número a moneda chilena
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        });
        return formatter.format(value);
    }
}
