import { ModalPublicidadService } from '../services/modal-publicidad.service';
import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService  } from '../services/cliente.service';
import { HttpEventType } from '@angular/common/http';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Factura } from '../../facturas/interfaces/factura';
import { FacturaService } from '../../facturas/services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { UserService } from 'src/app/usuarios/services/user.service';
import { User } from 'src/app/usuarios/interfaces/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-usuarios.component.html'
})
export class PerfilUsuariosComponent implements OnInit {


  user: User;
  titulo = 'Perfil Usuario';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';
  errores: string[];

  estadosFiltro: string[] = ['ANULADO', 'ESPERA', 'DESPACHO', 'ACTIVO'];
   filterFactura = '';


  estados: string[] = null;
  estadoFormulario: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private userService: UserService,
    private funcionesService: FuncionesService,
    public modalClienteService: ModalClienteService,
    public authService: AuthService,
    public facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    public modalPublicidadService: ModalPublicidadService
   ) {}


   ngOnInit() {
    this.loadingService.abrirModal();
    this.cargarUsuarioDetalle();

    this.estadoFormulario = new FormGroup({
      estado: new FormControl(null)
    });
    this.modalPublicidadService.abrirModal();
  }


    cargarUsuarioDetalle() {
      this.userService.getUser(JSON.parse(sessionStorage.getItem('usuario'))._id)
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
    }

  cambiarEstadoFactura(fact: Factura) {
    this.loadingService.abrirModal();
    let estado: string;
    estado = this.estadoFormulario.get('estado').value;
    if (estado !== 'Seleccione') {
      this.facturaService.cambiaEstadoFactura(fact._id, estado).subscribe(factura => {
      console.log(factura);
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

  cerrarModal() {
    this.modalClienteService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }

  compararEstado(o1: any, o2: any): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }

    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
}
