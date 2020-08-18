import { User } from '../interfaces/user';
import { UserService } from 'src/app/usuarios/services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { HttpEventType } from '@angular/common/http';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Factura } from '../../facturas/interfaces/factura';
import { FacturaService } from '../../facturas/services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-usuarios.component.html'
})
export class DetalleUsuariosComponent implements OnInit {

  @Input() user: User;
  titulo = 'Detalle Cliente';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';
  errores: string[];


  estados: string[] = null;
  default: string;
  estadoFormulario: FormGroup;

  constructor(
    private usuarioServicio: UserService,
    private funcionesService: FuncionesService,
    public modalClienteService: ModalClienteService,
    public authService: AuthService,
    public facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
   ) { }

   ngOnInit() {
    this.loadingService.abrirModal();
    this.cargarUsuarioDetalle();

    this.estadoFormulario = new FormGroup({
      estado: new FormControl(null)
    });
  }

  cambiarEstadoFactura(fact: Factura) {
    this.loadingService.abrirModal();
    let estado: string;
    estado = this.estadoFormulario.get('estado').value;
    if (estado !== 'Seleccione') {
      this.facturaService.cambiaEstadoFactura(fact._id, estado).subscribe(factura => {
      this.cargarUsuarioDetalle();
      // this.facturaService.cambiaEstadoFactura(id);
      this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[],
        this.loadingService.cerrarModal();
     });
    }
  }

  cargarUsuarioDetalle() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: string;
      id = params.get('id');
      this.usuarioServicio.getUser(id)
      .subscribe(user => {this.user = user,
        user.facturas.forEach((item: any) => {
          // aqui verificamos los datos del select
          if (this.authService.hasRole('ROLE_ADMIN') ) {
            this.estados = this.funcionesService.estadosFacturas(item.estado, 'ADMIN');
          } else {
            this.estados = this.funcionesService.estadosFacturas(item.estado, 'USER');
          }
          // tslint:disable-next-line: no-string-literal
          this.estadoFormulario.controls['estado'].setValue('Seleccione',
          {onlySelf: true});
        });
                          this.loadingService.cerrarModal();
     });
    });
  }
  cerrarModal() {
    this.modalClienteService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
}
