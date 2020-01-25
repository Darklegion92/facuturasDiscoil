import { Component, OnInit, Input } from '@angular/core';
import { Producto } from '../producto';
import { ProductoService  } from '../producto.service';
import { ModalProductoService  } from './modal-producto.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from './../../users/auth.service';
import { ModalProductoBuscarService } from './producto-buscar/modal-producto-buscar.service';
import { FuncionesService } from './../../generales/funciones.service';


@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  @Input() producto: Producto;
  titulo = 'Detalle Producto';
  precioCompraF: string;
  precioVentaF: string;
  public fotoSelecionada: File;
  progreso = 0;

  constructor(
    private productoService: ProductoService,
    public modalProductoService: ModalProductoService,
    public modalProductoBuscarService: ModalProductoBuscarService,
    private funcionesService: FuncionesService,
    public authService: AuthService
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
    this.productoService.subirFoto(this.fotoSelecionada, this.producto.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          const response: any = event.body;
          this.producto = response.producto as Producto;
          this.modalProductoService.notificarUpload.emit(this.producto);
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
    this.modalProductoService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
    this.modalProductoBuscarService.cerrarModal();
    this.producto = null;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
}

}
