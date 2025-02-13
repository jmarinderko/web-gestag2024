import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator',
  standalone: true
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (!value) {
      return '';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
