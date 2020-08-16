import { Component, OnInit } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { ProductoService } from '../services/producto.service';
import {Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html'
})

export class FormProductoComponent implements OnInit {

  prePrecioCompra: number;
  preCantidad: number;
  producto: Producto = new Producto();
  titulo = 'Crear Productos';
  errores: string[];

  constructor(
        private productoService: ProductoService,
        private router: Router,
        private funcionesServicer: FuncionesService,
        private activatedRoute: ActivatedRoute,
        public loadingService: LoadingService
        ) { }

  ngOnInit() {
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.productoService.getProducto(id).subscribe(
            (producto) => {this.producto = producto,
              this.prePrecioCompra = this.producto.precioCompra,
              this.preCantidad = this.producto.cantidad,
              this.loadingService.cerrarModal();
             }
            );
        }
      }
    );
    // this.categoriaService.getCategoriaLista().subscribe(categorias => this.categorias = categorias);
  }

  public create(): void {
    this.loadingService.abrirModal();
    if ( this.funcionesServicer.validarInputs(
      'texto', this.producto.nombre, 'Nombre', 3, 50) ) {

    } else if (this.funcionesServicer.validarInputs(
          'numero', this.producto.precioCompra, 'Precio Compra', 25, 100000000) ) {
           this.producto.precioCompra = 0;
    } else if (this.funcionesServicer.validarInputs(
               'numero', this.producto.precio, 'Precio Venta', 25, 100000000)) {
                 this.producto.precio = 0;
    } else if ( this.producto.precioCompra > this.producto.precio  ) {
      Swal.fire({
        type: 'error',
        title: `Precio De Venta Menor Al Precio De Compra:`,
        text: `El Precio De Venta debe ser 'MAYOR' o 'IGUAL' al Precio de Compra`,
        footer: `Favor Corregir!`
      });
    } else if (this.funcionesServicer.validarInputs(
               'numero', this.producto.cantidad, 'Cantidad', 0, 1000)) {
                  this.producto.cantidad = 0;
    } else {
      this.productoService.create(this.producto).subscribe(
        producto => {
          this.router.navigate(['/productos']),
          Swal.fire({
            type: 'success',
            title: `Producto:`,
            text: `${producto.nombre}`,
            footer: `Creado con Exito!`
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
  update(): void {
    this.loadingService.abrirModal();
    if ( this.prePrecioCompra !== this.producto.precioCompra
        && this.preCantidad !== this.producto.cantidad && this.producto.cantidad > 0 ) {
          const diferenciaDeCantidad = this.producto.cantidad - this.preCantidad;
          const inversionAnterior = this.prePrecioCompra * this.preCantidad;
          const inversionActual = this.producto.precioCompra * diferenciaDeCantidad;
          const inversionTotal = inversionAnterior + inversionActual;
          const nuevoCostoUnidad = ( inversionTotal / this.producto.cantidad );
          this.producto.precioCompra = nuevoCostoUnidad;
    }

    if ( this.funcionesServicer.validarInputs(
      'texto', this.producto.nombre, 'Nombre', 3, 50) ) {

    } else if (this.funcionesServicer.validarInputs(
          'numero', this.producto.precioCompra, 'Precio Compra', 25, 100000000) ) {
           this.producto.precioCompra = 0;
    } else if (this.funcionesServicer.validarInputs(
               'numero', this.producto.precio, 'Precio Venta', 25, 100000000)) {
                 this.producto.precio = 0;
    } else if ( this.producto.precioCompra > this.producto.precio  ) {
        Swal.fire({
          type: 'error',
          title: `Precio De Venta Menor Al Precio De Compra:`,
          text: `El Precio De Venta debe ser 'MAYOR' o 'IGUAL' al Precio de Compra`,
          footer: `Favor Corregir!`
        });
    } else if (this.funcionesServicer.validarInputs(
               'numero', this.producto.cantidad, 'Cantidad', 0, 1000)) {
                  this.producto.cantidad = 0;
    } else {
      this.productoService.update(this.producto)
      .subscribe(
        producto => {
          this.router.navigate(['/productos']),
          Swal.fire({
            type: 'success',
            title: `Producto:`,
            text: `${producto.nombre}`,
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

}

