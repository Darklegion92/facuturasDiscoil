import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../services/factura.service';
import { Factura } from '../interfaces/factura';
import { AuthService } from '../../usuarios/services/auth.service';
import { ModalFacturaService } from '../services/modalFactura.service';
import { ModalFacturaBuscarService } from '../services/modal-factura-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-filtrar-facturas',
  templateUrl: './filtrar-facturas.component.html',
})

export class FiltrarFacturasComponent implements OnInit {

  constructor(
    private facturaService: FacturaService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    private funcionesService: FuncionesService,
    public loadingService: LoadingService,
    public authService: AuthService
  ) { }

  titulo = 'Informes - Facturas';
  facturas: Factura[];
  fechaInicioFiltro: string;
  fechaFinFiltro: string;
  gananciaFiltro = 0;
  totalFiltro = 0;
  checked = false;
  errores: string[];


  estados: string[] = ['ANULADO', 'Seleccione'];
  estadosFiltro: string[] = ['ANULADO', 'ESPERA', 'DESPACHO', 'ACTIVO'];
  default: string;
  estadoFormulario: FormGroup;

  filterFactura = '';

  ngOnInit() {
    this.estadoFormulario = new FormGroup({
      estado: new FormControl(null)
    });

    this.cargarSelects();
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
    // console.log(factura);
    this.filtrarFacturas();
    // this.facturaService.cambiaEstadoFactura(id);
    this.loadingService.cerrarModal();
    },
    err => {
      this.errores = err.error.errors as string[],
      this.loadingService.cerrarModal();
   });
  }
}

  filtrarFacturas() {
    this.gananciaFiltro = 0;
    this.totalFiltro = 0;
    if (this.fechaInicioFiltro !== undefined && this.fechaInicioFiltro != null) {
      if (this.fechaFinFiltro !== undefined && this.fechaFinFiltro != null) {
            this.loadingService.abrirModal();
            this.facturaService.getFiltrarFacturasPorFecha(this.fechaInicioFiltro, this.fechaFinFiltro)
          .subscribe(
            facturas => {this.facturas = facturas;
                         this.facturas.forEach(datos => {
                          // tslint:disable-next-line: no-string-literal
            this.estadoFormulario.controls['estado'].setValue('Seleccione',
            {onlySelf: true});
                          });
                         this.loadingService.cerrarModal();
            },
          );
      } else {
        Swal.fire({
          type: 'error',
          title: `No ha Selecionado una Fecha`,
          text: 'Selecionar Fecha Final, para realizar busqueda',
          footer: '',
          });
      }
    } else {
      Swal.fire({
        type: 'error',
        title: `No ha Selecionado una Fecha`,
        text: 'Selecionar Fecha Inicial, para realizar busqueda',
        footer: '',
        });
    }
  }


formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }

}
