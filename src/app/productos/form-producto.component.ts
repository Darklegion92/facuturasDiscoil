import { Component, OnInit } from '@angular/core';
import { Producto } from './producto';
import { ProductoService } from './producto.service';
import { CategoriaService } from '../categorias/categoria.service';
import { Categoria } from '../categorias/categoria';
import {Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html'
})
export class FormProductoComponent implements OnInit {

  producto: Producto = new Producto();
  categorias: Categoria[];
  titulo = 'Crear Productos';
  errores: string[];
  constructor(
        private productoService: ProductoService,
        private categoriaService: CategoriaService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarProducto();
  }
  cargarProducto(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.productoService.getProducto(id).subscribe(
            (producto) => this.producto = producto);
        }
      }
    );
    // this.categoriaService.getCategoriaLista().subscribe(categorias => this.categorias = categorias);
  }

  public create(): void {
    if ( this.producto.precioCompra >= this.producto.precio  ) {
      Swal.fire({
        title: 'Oops...',
        text: 'El Precio De Venta debe ser MAYOR al de Compra',
        footer: 'Favor Corregir'
      });
    } else {
    this.productoService.create(this.producto).subscribe(
      producto => {
        this.router.navigate(['/productos']),
        Swal.fire(
          'Nuevo Producto,',
          `${producto.nombre}, creado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
    }
  }
  update(): void {
    this.productoService.update(this.producto)
    .subscribe(
      producto => {
        this.router.navigate(['/productos']),
        Swal.fire(
          'Producto,',
          `${producto.nombre}, Actualizado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  // public compararCategoria(o1: Categoria, o2: Categoria): boolean {
  //   if (o1 === undefined && o2 === undefined) {
  //     return true;
  //   }
  //   return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  // }



}

