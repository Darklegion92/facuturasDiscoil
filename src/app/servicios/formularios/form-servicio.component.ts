import { Component, OnInit } from '@angular/core';
import { Servicio } from '../interfaces/servicio';
import { ServicioService } from '../services/servicio.service';
import {Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html'
})
export class FormServicioComponent implements OnInit {

  servicio: Servicio = new Servicio();
  titulo = 'Crear Servicio';
  errores: string[];
  constructor(
        private servicioService: ServicioService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public loadingService: LoadingService
        ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.cargarServicio();
  }
  cargarServicio(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.servicioService.getServicio(id).subscribe(
            (servicio) => {this.servicio = servicio,
              this.loadingService.cerrarModal();
            });
        }
      }
    );
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.servicioService.create(this.servicio).subscribe(
      servicio => {
        Swal.fire({
          type: 'success',
          title: `Nuevo Servicio`,
          text: `${servicio.nombre}`,
          footer: `Creado con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  update(): void {
    this.loadingService.abrirModal();
    this.servicioService.update(this.servicio)
    .subscribe(
      servicio => {
        this.router.navigate(['/servicios']),
        Swal.fire({
          type: 'success',
          title: `Servicio`,
          text: `${servicio.nombre}`,
          footer: `Actualizado con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        this.loadingService.cerrarModal();
      }
    );
  }

}


