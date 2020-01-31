import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith, flatMap } from 'rxjs/operators';
import { ModalProductoBuscarService } from './modal-producto-buscar.service';
import { Producto } from './../../producto';
import { ProductoService } from './../../producto.service';
import { ModalProductoService } from './../modal-producto.service';
import { FuncionesService } from './../../../generales/funciones.service';
import { AuthService } from './../../../users/auth.service';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css']
})
export class ProductoBuscarComponent implements OnInit {
  id: number;
  producto: Producto;
  titulo = 'Buscar Producto';
  productoSelecionado: Producto;
  productosFiltrados: Observable<Producto[]>;
  autocompleteControl = new FormControl();

  constructor(
    public modalProductoBuscarService: ModalProductoBuscarService,
    public modalProductoService: ModalProductoService,
    public authService: AuthService,
    public productoService: ProductoService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit() {
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.productoService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    this.producto = event.option.value as Producto;
    this.id = this.producto.id;
    // console.log('seleciono producto: ');
    // console.log(this.producto);
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }
  abrirModal(producto: Producto) {
    this.productoSelecionado = producto;
    this.modalProductoService.abrirModal();
  }

  cerrarModalBusquedaProducto() {
    this.modalProductoBuscarService.cerrarModal();
    this.producto = null;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
}
