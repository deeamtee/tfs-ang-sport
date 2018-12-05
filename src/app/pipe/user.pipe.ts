import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'useremail'
})
export class UserPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== null && typeof value !== 'undefined'){
      value = value.split('@')[0];
      console.log(value);
      return `${value}`;
    }
  }

}
