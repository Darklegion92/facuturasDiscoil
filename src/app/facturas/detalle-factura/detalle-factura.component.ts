import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../services/factura.service';
import { AuthService } from '../../usuarios/services/auth.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo = 'Factura';
  errores: string[];


  estados: string[] = null;
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

    this.loadingService.abrirModal();

    this.cargarFacura();

  }


  cambiarEstadoFactura(fact: Factura) {
    this.loadingService.abrirModal();
    let estado: string;
    estado = this.estadoFormulario.get('estado').value;
    if (estado !== 'Seleccione') {
      this.facturaService.cambiaEstadoFactura(fact._id, estado).subscribe(factura => {
      // console.log(factura);
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
      // console.log('llego con id ' + id);
      this.facturaService.getFactura(id)
      .subscribe(factura => {this.factura = factura;
           // aqui verificamos los datos del select que cargara la tabla
                             if (this.authService.hasRole('ROLE_ADMIN') ) {
            this.estados = this.funcionesService.estadosFacturas(this.factura.estado, 'ADMIN');
          } else {
            this.estados = this.funcionesService.estadosFacturas(this.factura.estado, 'USER');
          }
           // tslint:disable-next-line: no-string-literal
                             this.estadoFormulario.controls['estado'].setValue('Seleccione',
           {onlySelf: true});
                             this.loadingService.cerrarModal();
      });
    });
  }

  formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }

}
