import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'negativeSign'
})
export class NegativeSignPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return +value === 0 ? +value : '-' + value;
    }

}
