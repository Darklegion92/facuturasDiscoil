import { UserService } from 'src/app/users/services/user.service';
import { User } from './../../users/interfaces/user';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService } from '../services/cliente.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../../users/services/auth.service';
import { ModalFacturaService } from '../../facturas/services/modalFactura.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})

export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  usuarios: User[];
  link = '/clientes/page';
  paginador: any;
  // clienteSelecionado: User;

  constructor(
    private clienteService: ClienteService,
    private usuarioService: UserService,
    public modalClienteService: ModalClienteService,
    public modalFacturaService: ModalFacturaService,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    public authService: AuthService) {
    }

  ngOnInit() {
    this.usuarioService.getUsers()
    .subscribe(
      usuarios => {this.usuarios = usuarios;
                   this.usuarios.forEach(datos => {
                     console.log(this.usuarios);
                    });
                   this.loadingService.cerrarModal();
      },
    );
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar Al Cliente ${cliente.nombre} ${cliente.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Cliente!'
    }).then((result) => {
      if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente);
              Swal.fire(
                'Borrado!',
                `Cliente ${cliente.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  abrirModal() {
    this.modalFacturaService.abrirModal();
  }

}
