import { Component, OnInit } from '@angular/core';
import { Categoria } from '../interfaces/categoria';
import { CategoriaService } from '../services/categoria.service';
import {Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-categorias',
  templateUrl: './form-categorias.component.html'
})
export class FormCategoriasComponent implements OnInit {

  categoria: Categoria = new Categoria();
  titulo = 'Crear Categoria';
  errores: string[];
  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCategoria();
  }
  cargarCategoria(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.categoriaService.getCategoria(id).subscribe(
            (categoria) => this.categoria = categoria);
        }
      }
    );
  }
  public create(): void {
    this.categoriaService.create(this.categoria).subscribe(
      categoria => {
        this.router.navigate(['/categorias']),
        Swal.fire({
          type: 'success',
          title: 'Nueva Categoria',
          text: `${categoria.nombre}, creado con Exito!`,
          footer: '',
          });
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  update(): void {
    this.categoriaService.update(this.categoria)
    .subscribe(
      categoria => {
        this.router.navigate(['/categorias']),
        Swal.fire({
          type: 'success',
          title: 'Categoria',
          text: `${categoria.nombre}, Actualizada con Exito!`,
          footer: '',
          });
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

}

