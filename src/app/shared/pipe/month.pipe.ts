import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month',
  standalone: true,
})
export class MonthPipe implements PipeTransform {
  transform(value: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[value - 1] || '';
  }
}
