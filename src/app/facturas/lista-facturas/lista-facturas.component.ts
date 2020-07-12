import { Component, OnInit } from '@angular/core';
import { FacturaService } from './../services/factura.service';
import { Factura } from '../interfaces/factura';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../users/services/auth.service';
import { ModalFacturaService } from './../services/modalFactura.service';
import { ModalFacturaBuscarService } from './../services/modal-factura-buscar.service';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { UserService } from '../../users/services/user.service';
import { User } from 'src/app/users/interfaces/user';
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


  estados: string[] = ['ANULADO', 'Seleccione'];
  default: string;
  estadoFormulario: FormGroup;

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

    this.cargarSelects();

    this.cargarListadoFacturas();
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
                        //  this.facturas.forEach(datos => {
                        //   // console.log(this.facturas);
                        //   });
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
