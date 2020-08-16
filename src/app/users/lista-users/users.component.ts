import { Component, OnInit } from '@angular/core';
import { User } from '../../usuarios/interfaces/user';
import { UserService } from '../../usuarios/services/user.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalUserService  } from '../../usuarios/services/modal-user.service';
import { AuthService } from '../../usuarios/services/auth.service';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
  users: User[];
  paginador: any;
  userSelecionado: User;
  tipoUsuario: string;
  link = '/users/page';

  constructor(
    private userService: UserService,
    public modalUserService: ModalUserService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService
    ) { }

  ngOnInit() {
  }

  delete(user: User): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar Al Usuario ${user.nombre} ${user.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Usuario!'
    }).then((result) => {
      if (result.value) {
          this.userService.delete(user.id).subscribe(
            response => {
              this.users = this.users.filter(cli => cli !== user);
              Swal.fire(
                'Borrado!',
                `Usuario ${user.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  abrirModal(user: User) {
    this.userSelecionado = user;
    this.modalUserService.abrirModal();
  }

  tipoUsuarios(num: number): string {
    if (num === 1) {
      this.tipoUsuario = 'USUARIO';
    } else {
      this.tipoUsuario = 'ADMINISTRADOR';
    }
    return this.tipoUsuario;
  }

}
