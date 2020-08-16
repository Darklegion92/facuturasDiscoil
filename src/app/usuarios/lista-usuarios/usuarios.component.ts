import { UserService } from 'src/app/usuarios/services/user.service';
import { User } from '../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService } from '../services/cliente.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../services/auth.service';
import { ModalFacturaService } from '../../facturas/services/modalFactura.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './usuarios.component.html'
})

export class UsuariosComponent implements OnInit {

  usuarios: User[];
  link = '/clientes/page';
  paginador: any;
  // clienteSelecionado: User;

  constructor(
    private usuarioService: UserService,
    public loadingService: LoadingService,
    public authService: AuthService) {
    }

  ngOnInit() {
    this.usuarioService.getUsers()
    .subscribe(
      usuarios => {this.usuarios = usuarios;
                   this.usuarios.forEach(datos => {
                    });
                   this.loadingService.cerrarModal();
      },
    );
  }


}
