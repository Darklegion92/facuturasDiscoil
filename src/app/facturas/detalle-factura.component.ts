import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from './services/factura.service';
import { AuthService } from './../users/auth.service';
import { FuncionesService } from './../generales/funciones.service';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo = 'Factura';

  constructor(
              private facturaService: FacturaService,
              private funcionesService: FuncionesService,
              public authService: AuthService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.facturaService.getFactura(id)
      .subscribe(factura => this.factura = factura);
    });
  }

  generarFactura(factura: Factura): void {
     const facturaPDF = new jsPDF();
     facturaPDF.setFontSize(22);
     facturaPDF.text('JOTACELL', 7, 7);
     facturaPDF.setFontSize(16);
     facturaPDF.text('Remision #: ' + factura.id , 10, 12);
     facturaPDF.setFontSize(10);
     facturaPDF.text('Cel: 311 2819686', 10, 16);
     facturaPDF.setFontSize(6);
     facturaPDF.text('Fecha: ' + factura.createAt , 5, 20);
     facturaPDF.text('Descripcion: ' + factura.descripcion, 5, 22);
     facturaPDF.text('Cliente: ' + factura.cliente.nombre + ' ' + factura.cliente.apellido , 5, 25);
     facturaPDF.text('C.C: ' + factura.cliente.documento, 5, 27);
     facturaPDF.text('------------------------------------------------------', 5, 29);
     facturaPDF.text('Cant. '  , 5, 32);
     facturaPDF.text('Artl. '  , 14, 32);
     facturaPDF.text('Valor '  , 22, 32);
     facturaPDF.text('Sub-Total '  , 35, 32);
     let conta = 35;
     for (const i of factura.items) {
      facturaPDF.text('' + i.cantidad, 5, conta);
      facturaPDF.text('' + i.producto.nombre , 11, conta);
      conta += 2;
      facturaPDF.text('' + this.formatNumber(i.producto.precio), 22, conta);
      facturaPDF.text('' + this.formatNumber(i.importe), 34, conta);
      conta += 5;


  }
     if (factura.descuento != null && factura.descuento > 0) {
      facturaPDF.text('Descuento: ' + this.formatNumber(factura.descuento), 22, conta);
      conta += 3;
    }

     facturaPDF.text('Total: ' + this.formatNumber(factura.total), 28, conta);
     conta += 2;
     facturaPDF.text('------------------------------------------------------', 5, conta);
     conta += 5;
     facturaPDF.text('* Para cualquiero tipo de reclamo ó ', 5, conta);
     conta += 2;
     facturaPDF.text(' garantia debe presentar este documento.* ', 5, conta);
     conta += 2;
     facturaPDF.save('prueba.pdf');
   }

  formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }

}
