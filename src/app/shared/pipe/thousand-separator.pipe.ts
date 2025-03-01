import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator',
  standalone: true
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
