import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatoNumeroMoneda'
})
export class FormatoNumeroMonedaPipe implements PipeTransform {

  transform(valor: any, tipo:string = 'numero'): string {

    if(tipo === 'moneda'){
      var retorno = '';
      var valorStr: string = valor.toString().split('').reverse().join('');
      var i = valorStr.length;
      while(i>0) retorno += ((i%3===0&&i!=valorStr.length)?'.':'')+valorStr.substring(i--,i);
      return '$ '+retorno;
    }else{
      var retorno = '';
      var valorStr: string = valor.toString().split('').reverse().join('');
      var i = valorStr.length;
      while(i>0) retorno += ((i%3===0&&i!=valorStr.length)?'.':'')+valorStr.substring(i--,i);
      return retorno;
    }
    

    

  }

}
