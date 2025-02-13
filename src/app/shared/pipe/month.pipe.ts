import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month',
  standalone: true,
})
export class MonthPipe implements PipeTransform {
  private months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(value: number): string {
    if (value < 1 || value > 12) {
      return 'Mes inválido'; // Manejo de valores fuera de rango
    }
    return this.months[value - 1];
  }
}
