import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilterTable'
})
export class SearchFilterTablePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
