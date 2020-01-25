import { Component, OnInit } from '@angular/core';
import { Region } from './region';
import { RegionService } from './region.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-regiones',
  templateUrl: './form-regiones.component.html'
})
export class FormRegionesComponent implements OnInit {

  region: Region = new Region();
  titulo = 'Crear Region';
  errores: string[];
  constructor(
    private regionService: RegionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarRegion();
  }
  cargarRegion(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.regionService.getRegion(id).subscribe(
            (region) => this.region = region);
        }
      }
    );
  }
  public create(): void {
    this.regionService.create(this.region).subscribe(
      region => {
        this.router.navigate(['/regiones']),
        Swal.fire(
          'Nuevo Barrio,',
          `${region.nombre}, creado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log(err);
      }
    );
  }
  update(): void {
    this.regionService.update(this.region)
    .subscribe(
      region => {
        this.router.navigate(['/regiones']),
        Swal.fire(
          ' Barrio,',
          `${region.nombre}, Actualizado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

}

