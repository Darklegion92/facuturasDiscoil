import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from '../regiones/region';
import { RegionService } from '../regiones/region.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html'
})
export class FormClienteComponent implements OnInit {

  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo = 'Crear Cliente';
  errores: string[];
  constructor(
    private clienteService: ClienteService,
    private regionService: RegionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.clienteService.getCliente(id).subscribe(
            (cliente) => this.cliente = cliente);
        }
      });
    this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']),
        Swal.fire(
          'Nuevo Cliente,',
          `${cliente.nombre}, creado con Exito!`,
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
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente)
    .subscribe(
      cliente => {
        this.router.navigate(['/clientes']),
        Swal.fire(
          ' Cliente,',
          `${cliente.nombre}, Actualizado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  public compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
