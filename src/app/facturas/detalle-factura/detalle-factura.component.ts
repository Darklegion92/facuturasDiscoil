import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../services/factura.service';
import { AuthService } from '../../users/services/auth.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo = 'Factura';
  errores: string[];


  estados: string[] = ['ANULADO', 'Seleccione'];
  default: string;
  estadoFormulario: FormGroup;

  constructor(
              private facturaService: FacturaService,
              private funcionesService: FuncionesService,
              public authService: AuthService,
              private activatedRoute: ActivatedRoute,
              public loadingService: LoadingService
              ) { }

  ngOnInit() {
    this.estadoFormulario = new FormGroup({
      estado: new FormControl(null)
    });

    this.cargarSelects();
    this.loadingService.abrirModal();

    this.cargarFacura();

  }

  cargarSelects(): void {
    if (this.authService.hasRole('ROLE_ADMIN') ) {
      this.estados = ['ANULADO', 'ESPERA', 'DESPACHO', 'ACTIVO', 'Seleccione'] ;
    }
  }

  cambiarEstadoFactura(fact: Factura) {
    this.loadingService.abrirModal();
    let estado: string;
    estado = this.estadoFormulario.get('estado').value;
    if (estado !== 'Seleccione') {
      this.facturaService.cambiaEstadoFactura(fact._id, estado).subscribe(factura => {
      console.log(factura);
      this.cargarFacura();
      // this.facturaService.cambiaEstadoFactura(id);
      this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[],
        this.loadingService.cerrarModal();
     });
    }
  }

  cargarFacura() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: string;
      id = params.get('id');
      console.log('llego con id ' + id);
      this.facturaService.getFactura(id)
      .subscribe(factura => {this.factura = factura,
           this.loadingService.cerrarModal();
      });
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
     facturaPDF.text('Observacion: ' + factura.observacion, 28, conta);
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
