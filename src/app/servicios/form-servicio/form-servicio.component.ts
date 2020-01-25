import { Component, OnInit } from '@angular/core';
import { Servicio } from '../servicio';
import { ServicioService } from '../servicio.service';
import {Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
        private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarServicio();
  }
  cargarServicio(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.servicioService.getServicio(id).subscribe(
            (servicio) => this.servicio = servicio);
        }
      }
    );
  }

  public create(): void {
    this.servicioService.create(this.servicio).subscribe(
      servicio => {
        this.router.navigate(['/servicios']),
        Swal.fire(
          'Nuevo Servicio,',
          `${servicio.nombre}, creado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  update(): void {
    this.servicioService.update(this.servicio)
    .subscribe(
      servicio => {
        this.router.navigate(['/servicios']),
        Swal.fire(
          'Servicio,',
          `${servicio.nombre}, Actualizado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

}


