import { Component, OnInit } from '@angular/core';
import { Servicio } from '../interfaces/servicio';
import { ServicioService } from '../services/servicio.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalServicioService  } from '../services/modal-servicio.service';
import { AuthService } from '../../users/services/auth.service';
import { ModalServicioBuscarService } from '../services/modal-servicio-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements OnInit {

  servicios: Servicio[];
  paginador: any;
  servicioSelecionado: Servicio;
  link = '/servicios/page';

  constructor(
    private servicioService: ServicioService,
    public modalServicioService: ModalServicioService,
    public modalServicioBuscarService: ModalServicioBuscarService,
    private activatedRoute: ActivatedRoute,
    private funcionesService: FuncionesService,
    public authService: AuthService) { }

  ngOnInit() {
    this.cerrarModalBusquedaServicio();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.servicioService.getServicios(page)
    .pipe(
      tap( response => {
        console.log('ServicioComponent: tap 3');
        (response.content as Servicio[]).forEach(servicio => {
          // console.log(servicio);
        });
      })
    ).subscribe(response => {
      this.servicios = response.content as Servicio[];
      this.paginador = response;
    });
    });
  }

  delete(servicio: Servicio): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar El Producto ${servicio.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Servicio!'
    }).then((result) => {
      if (result.value) {
          this.servicioService.delete(servicio.id).subscribe(
            response => {
              this.servicios = this.servicios.filter(cli => cli !== servicio);
              Swal.fire(
                'Borrado!',
                `Producto ${servicio.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }
  abrirModal(servicio: Servicio) {
    this.servicioSelecionado = servicio;
    this.modalServicioService.abrirModal();
  }

  abrirModalServicioBuscar() {
     this.modalServicioBuscarService.abrirModal();
  }

  cerrarModalBusquedaServicio() {
     this.modalServicioBuscarService.cerrarModal();
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}

