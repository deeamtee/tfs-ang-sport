import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'welcome'
})
export class WelcomePipe implements PipeTransform {

  transform(value: string): string {
    if (value !== null && typeof value !== 'undefined') {

      value = value.split('@')[0];
      value = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return `${value}`;
    }
  }
}
