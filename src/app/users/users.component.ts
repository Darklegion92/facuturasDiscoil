import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalUserService  } from './detalle-user/modal-user.service';
import { AuthService } from './../users/auth.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[];
  paginador: any;
  userSelecionado: User;
  tipoUsuario: string;
  constructor(
    private userService: UserService,
    public modalUserService: ModalUserService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.userService.getUsers(page)
    .pipe(
      tap( response => {
        // console.log('UsersComponent: tap 3');
        (response.content as User[]).forEach(user => {
        //  console.log(user.roles.length);

        });
      })
    ).subscribe(response => {
      this.users = response.content as User[];
      this.paginador = response;
    });
  });
    this.modalUserService.notificarUpload.subscribe(user => {
    this.users = this.users.map( userOriginal => {
      if (user.id === userOriginal.id) {
        userOriginal.foto = user.foto;
      }
      return userOriginal;
    });
  });
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
