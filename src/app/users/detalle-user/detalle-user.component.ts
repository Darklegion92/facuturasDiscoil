import { Component, Input } from '@angular/core';
import { User } from '../../usuarios/interfaces/user';
import { UserService  } from '../../usuarios/services/user.service';
import { ModalUserService  } from '../../usuarios/services/modal-user.service';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../usuarios/services/auth.service';

@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['../../generales/css/modal.css']
})
export class DetalleUserComponent {

  @Input() user: User;
  titulo = 'Detalle Usuarios';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';

  constructor(
    private userService: UserService,
    public authService: AuthService,
    public modalUserService: ModalUserService
   ) { }

  seleccionarFoto(event) {
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSelecionada.type.indexOf('image') < 0) {
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Selecionar Imagen',
        text: `El archivo debe ser del tipo 'Imagen'`,
        footer: 'Intente de nuevo',
        });
      this.fotoSelecionada = null;
    } else {
      this.rutaFoto = this.fotoSelecionada.name;
    }
  }


  cerrarModal() {
    this.modalUserService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
