import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from '../regiones/region';
import { RegionService } from '../regiones/region.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html'
})


export class FormClienteComponent implements OnInit {

  constructor(
              private clienteService: ClienteService,
              private regionService: RegionService,
              private router: Router,
              private activatedRoute: ActivatedRoute
              ) { }

  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo = 'Crear Cliente';
  errores: string[];

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
        console.log(err);
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
