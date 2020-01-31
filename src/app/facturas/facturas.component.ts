import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { ItemFactura } from './models/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import Swal from 'sweetalert2';
import { Producto } from './../productos/producto';
import { ProductoService } from './../productos/producto.service';
import { AuthService } from './../users/auth.service';
import { UserService } from './../users/user.service';
import { FuncionesService } from './../generales/funciones.service';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {
  titulo = 'Nueva Factura';
  products = Producto;
  factura: Factura = new Factura();
  errores: string[];
  checked = false;
  autocompleteControl = new FormControl();

  productosFiltrados: Observable<Producto[]>;

  constructor(
              private clienteService: ClienteService,
              private userService: UserService,
              private facturaService: FacturaService,
              private productoService: ProductoService,
              public authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private funcionesService: FuncionesService,
              ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      const clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId)
      .subscribe(cliente => this.factura.cliente = cliente);
      this.userService.getUser(JSON.parse(sessionStorage.getItem('usuario')).id)
      .subscribe(usuario => this.factura.usuario = usuario);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toUpperCase();
    return this.productoService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      if (producto.cantidad > 0) {
        this.factura.items.push(nuevoItem);
        // guarda en el localStore
      }
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;
    if (cantidad <= 0) {
        this.checked = false;
        return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        // restara cantidad al producto
        if (item.producto.cantidad > 0 && item.cantidad <= item.producto.cantidad) {
          item.cantidad = cantidad;
        } else {
          Swal.fire(
            'error',
            'La cantidad de Articulos supera al Stock',
            'error'
          );
          this.checked = false;
          item.cantidad = 1;
        }
      }
      return item;
    });
  }
  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        if (item.producto.cantidad > 0) {
          ++item.cantidad;
        }
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.checked = false;
    this.factura.items = this.factura.items
    .filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm): void {
    // console.log(this.factura);
    if (this.factura.items.length === 0) {
      this.autocompleteControl.setErrors({ invalid: true });
    }

    if (facturaForm.form.valid && this.factura.items.length > 0) {
      // this.factura.user = this.usuario;
      this.factura.totalGanancia = this.factura.calcularGananciaTotal();
      this.facturaService.create(this.factura).subscribe(factura => {
        this.factura.items.forEach((item: ItemFactura) => {
          item.producto.cantidad = item.producto.cantidad - item.cantidad;
          this.productoService.update(item.producto)
          .subscribe(
            producto => {
              Swal.fire(
                'Facturado!',
                `${factura.descripcion} Creada con éxito!`,
                'success'
              );
              this.router.navigate(['/facturas', factura.id]);
            },
            err => {
              this.errores = err.error.errors as string[];
            }
          );
        });
      });
    }
  }

  validarDescuento(dato: Factura): string {
    if (dato !== null) {
      if (dato.descuento <= dato.calcularGananciaTotal()) {
        return this.formatNumber(dato.descuento);
      } else {
        dato.descuento = 0;
        Swal.fire(
          'error',
          'esta aplicando un descuento que supera la ganancia',
          'error'
        );
        return '0';
      }
    }
  }

  formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }

}
