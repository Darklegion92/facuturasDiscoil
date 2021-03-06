import { Component, Input } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { ProductoService  } from '../services/producto.service';
import { ModalProductoService  } from '../services/modal-producto.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/services/auth.service';
import { ModalProductoBuscarService } from '../producto-buscar/modal-producto-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';


@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['../../generales/css/modal.css']
})
export class DetalleProductoComponent  {

  @Input() producto: Producto;
  titulo = 'Detalle Producto';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';

  constructor(
    private productoService: ProductoService,
    public modalProductoService: ModalProductoService,
    public modalProductoBuscarService: ModalProductoBuscarService,
    private funcionesService: FuncionesService,
    public authService: AuthService
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

  subirFoto() {
    console.log('ingreso a subir foto');
    if (!this.fotoSelecionada) {
      this.rutaFoto = 'Selecionar Foto';
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Imagen',
        text: `No ha selecionado una imagen`,
        footer: 'Intente de nuevo',
        });
    } else {
    this.productoService.subirFoto(this.fotoSelecionada, this.producto.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          const response: any = event.body;
          this.producto = response.producto as Producto;
          this.modalProductoService.notificarUpload.emit(this.producto);
          this.rutaFoto = 'Selecionar Foto';
          this.fotoSelecionada = null;
          Swal.fire({
            type: 'success',
            title: 'La Foto se ha subido con Exito!',
            text: response.mensaje,
            footer: '',
            });
          // pendiente meter un time out
          this.progreso = 0;
      }
    });
  }
  }
  cerrarModal() {
    this.modalProductoService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
    this.modalProductoBuscarService.cerrarModal();
    this.producto = null;
  }
  calcularInversion(cantidad: number, precioCompra: number): string {
    const inversion = cantidad * precioCompra;
    return this.formatNumber(inversion);
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
}

}
