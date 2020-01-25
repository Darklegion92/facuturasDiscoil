import { Component, OnInit } from '@angular/core';
import { FacturaService } from './../services/factura.service';
import { Factura } from './../models/factura';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../users/auth.service';
import { ModalFacturaService } from './../services/modalFactura.service';
import { ModalFacturaBuscarService } from './../services/modal-factura-buscar.service';
import { ProductoService } from './../../productos/producto.service';
import { FuncionesService } from './../../generales/funciones.service';


@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html'
})
export class ListaFacturasComponent implements OnInit {
  dato = ' prueba ';
  facturas: Factura[];
  facturaFecha: Factura[];
  paginador: any;
  constructor(
    private facturaService: FacturaService,
    private productoService: ProductoService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    private funcionesService: FuncionesService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.facturaService.getFacturas(page)
    .pipe(
      tap( response => {
        //  console.log('FacturasComponent: tap 3');
        (response.content as Factura[]).forEach(cliente => {
        //  console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.facturas = response.content as Factura[];
      this.paginador = response;
      });
    });
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

  abrirModal() {
    this.modalFacturaService.abrirModal();
  }
  abrirModalBuscarFactura() {
    this.modalFacturaBuscarService.abrirModal();
  }

}
