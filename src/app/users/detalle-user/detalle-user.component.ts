import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { UserService  } from '../user.service';
import { ModalUserService  } from './modal-user.service';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['./detalle-user.component.css']
})
export class DetalleUserComponent implements OnInit {

  @Input() user: User;
  titulo = 'Detalle Usuarios';
  public fotoSelecionada: File;
  progreso = 0;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    public modalUserService: ModalUserService
   ) { }

  ngOnInit() {

  }
  seleccionarFoto(event) {
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSelecionada.type.indexOf('image') < 0) {
      Swal.fire(
        'Error al Subir Selecionar Imagen',
        'El archivo debe ser del tipo "Imagen"',
        'error'
      );
      this.fotoSelecionada = null;
    }
  }
  subirFoto() {
    if (!this.fotoSelecionada) {
      Swal.fire(
        'Error al Subir Imagen',
        'No ha selecionado una imagen',
        'error'
      );

    } else {
    this.userService.subirFoto(this.fotoSelecionada, this.user.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          const response: any = event.body;
          this.user = response.user as User;
          this.modalUserService.notificarUpload.emit(this.user);
          Swal.fire(
            'La Foto se ha subido con Exito!',
            response.mensaje,
            'success'
          );
      }
    });
  }
  }
  cerrarModal() {
    this.modalUserService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
