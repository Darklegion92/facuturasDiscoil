import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  constructor() { }

  formatNumber(numero: number): string {
      if (numero !== null && numero !== undefined) {
        const separador = '.'; // separador para los miles
        const sepDecimal = ','; // separador para los decimales
        let num: string;
        num = numero.toString();
        num += '';
        const splitStr = num.split('.');
        let splitLeft = splitStr[0];
        const splitRight = splitStr.length > 1 ? sepDecimal + splitStr[1] : '';
        const regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
        }
        num = '$' + splitLeft + splitRight;
        return num;
      }
    }

}
