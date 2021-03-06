import { Component, OnInit } from '@angular/core';
import { FacturaService } from './../services/factura.service';
import { Factura } from '../interfaces/factura';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../usuarios/services/auth.service';
import { ModalFacturaService } from './../services/modalFactura.service';
import { ModalFacturaBuscarService } from './../services/modal-factura-buscar.service';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { UserService } from '../../usuarios/services/user.service';
import { User } from 'src/app/usuarios/interfaces/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html'
})
export class ListaFacturasComponent implements OnInit {
  dato = ' prueba ';
  facturas: Factura[];
  facturaFecha: Factura[];
  paginador: any;
  link = '/facturas/page';
  id: number;
  usuario: User;

  errores: string[];


  estados: string[] = null;
   estadoFormulario: FormGroup;

  estadosFiltro: string[] = ['ANULADO', 'ESPERA', 'DESPACHO', 'ACTIVO'];
  filterFactura = '';

  constructor(
    private facturaService: FacturaService,
    private productoService: ProductoService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    private funcionesService: FuncionesService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.estadoFormulario = new FormGroup({
      estado: new FormControl(null)
    });
    this.cargarListadoFacturas();
  }

cambiarEstadoFactura(fact: Factura) {
  this.loadingService.abrirModal();
  let estado: string;
  estado = this.estadoFormulario.get('estado').value;
  if (estado !== 'Seleccione') {
    this.facturaService.cambiaEstadoFactura(fact._id, estado).subscribe(factura => {
    this.cargarListadoFacturas();
    // this.facturaService.cambiaEstadoFactura(id);
    this.loadingService.cerrarModal();
    },
    err => {
      this.errores = err.error.errors as string[],
      this.loadingService.cerrarModal();
   });
  }
}

cargarListadoFacturas() {
  this.facturaService.getFacturas()
          .subscribe(
            facturas => {this.facturas = facturas;
                         this.facturas.forEach(item => {
              // aqui verificamos los datos del select
              if (this.authService.hasRole('ROLE_ADMIN') ) {
                this.estados = this.funcionesService.estadosFacturas(item.estado, 'ADMIN');
                } else {
                  this.estados = this.funcionesService.estadosFacturas(item.estado, 'USER');
                  }
              });
                         this.estadoFormulario.controls.estado.setValue('Seleccione',
                        {onlySelf: true});
                         this.loadingService.cerrarModal();
            },
          );
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
