import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService  } from '../cliente.service';
import { HttpEventType } from '@angular/common/http';
import { ModalClienteService  } from './modal-cliente.service';
import { AuthService } from './../../users/auth.service';
import Swal from 'sweetalert2';
import { Factura } from './../../facturas/models/factura';
import { FacturaService } from './../../facturas/services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from './../../productos/producto.service';
import { FuncionesService } from './../../generales/funciones.service';



@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html'
})
export class DetalleClienteComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo = 'Detalle Cliente';
  public fotoSelecionada: File;
  progreso = 0;
  constructor(
    private clienteService: ClienteService,
    private funcionesService: FuncionesService,
    public modalClienteService: ModalClienteService,
    public authService: AuthService,
    public facturaService: FacturaService,
    private activatedRoute: ActivatedRoute
   ) { }

   ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
    });
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
      this.clienteService.subirFoto(this.fotoSelecionada, this.cliente.id)
      .subscribe( event => {
        if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalClienteService.notificarUpload.emit(this.cliente);
            Swal.fire(
              'La Foto se ha subido con Exito!',
              response.mensaje,
              'success'
            );
        }
      });
    }
  }
  delete(factura: Factura): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar la Factura ${factura.descripcion} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Factura!'
    }).then((result) => {
      if (result.value) {
          this.facturaService.delete(factura.id).subscribe(
            response => {
              this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
              Swal.fire(
                'Borrada!',
                `Factura ${factura.descripcion} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
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
