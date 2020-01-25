import { Component, OnInit } from '@angular/core';
import { FacturaService } from './../services/factura.service';
import { Factura } from './../models/factura';
import { AuthService } from './../../users/auth.service';
import { ModalFacturaService } from './../services/modalFactura.service';
import { ModalFacturaBuscarService } from './../services/modal-factura-buscar.service';
import { FuncionesService } from './../../generales/funciones.service';



@Component({
  selector: 'app-filtrar-facturas',
  templateUrl: './filtrar-facturas.component.html',
})
export class FiltrarFacturasComponent implements OnInit {
  facturas: Factura[];
  fechaInicioFiltro: string;
  fechaFinFiltro: string;
  gananciaFiltro = 0;
  totalFiltro = 0;

  constructor(
    private facturaService: FacturaService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    private funcionesService: FuncionesService,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  filtrarFacturas() {
    this.gananciaFiltro = 0;
    this.totalFiltro = 0;
    if (this.fechaInicioFiltro !== undefined && this.fechaInicioFiltro != null) {
      if (this.fechaFinFiltro !== undefined && this.fechaFinFiltro != null) {
            this.facturaService.getFiltrarFacturasPorFecha(this.fechaInicioFiltro, this.fechaFinFiltro)
          .subscribe(
            facturas => {this.facturas = facturas;
                         this.facturas.forEach(datos => {
                          this.gananciaFiltro += datos.totalGanancia;
                          this.totalFiltro += datos.total;
                          });
            }

          );
      }
    }
  }


formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }
}
