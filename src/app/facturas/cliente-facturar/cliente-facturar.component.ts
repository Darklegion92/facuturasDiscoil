import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';

import { ModalFacturaService } from './../services/modalFactura.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Cliente } from './../../clientes/cliente';

import { ClienteService } from './../../clientes/cliente.service';

@Component({
  selector: 'app-cliente-facturar',
  templateUrl: './cliente-facturar.component.html',
  styleUrls: ['./cliente-facturar.component.css']
})
export class ClienteFacturarComponent implements OnInit {
  id: number;
  cliente: Cliente;
  titulo = 'Buscar Cliente';
  clientesFiltrados: Observable<Cliente[]>;
  autocompleteControl = new FormControl();

  constructor(
    public modalFacturaService: ModalFacturaService,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.clientesFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Cliente[]> {
    const filterValue = value.toLowerCase();
    return this.clienteService.filtrarClientes(filterValue);
  }

  mostrarNombre(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  seleccionarCliente(event: MatAutocompleteSelectedEvent): void {
    this.cliente = event.option.value as Cliente;
    this.id = this.cliente.id;
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  cerrarModal() {
    this.modalFacturaService.cerrarModal();
    this.cliente = null;
  }
}
