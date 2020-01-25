import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map, flatMap } from 'rxjs/operators';
import { ModalServicioBuscarService } from './modal-servicio-buscar.service';
import { Servicio } from './../../servicio';
import { ServicioService } from './../../servicio.service';
import { ModalServicioService } from './../modal-servicio.service';
import { FuncionesService } from './../../../generales/funciones.service';

@Component({
  selector: 'app-servicio-buscar',
  templateUrl: './servicio-buscar.component.html',
  styleUrls: ['./servicio-buscar.component.css']
})
export class ServicioBuscarComponent implements OnInit {
  id: number;
  servicio: Servicio;
  titulo = 'Buscar Servicio';
  servicioSelecionado: Servicio;
  serviciosFiltrados: Observable<Servicio[]>;
  autocompleteControl = new FormControl();

  constructor(
    public modalServicioBuscarService: ModalServicioBuscarService,
    public modalServicioService: ModalServicioService,
    public servicioService: ServicioService,
    private funcionesService: FuncionesService,
  ) { }

  ngOnInit() {
    this.serviciosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Servicio[]> {
    const filterValue = value.toLowerCase();
    return this.servicioService.filtrarServicios(filterValue);
  }

  mostrarNombre(servicio?: Servicio): string | undefined {
    return servicio ? servicio.nombre : undefined;
  }

  seleccionarServicio(event: MatAutocompleteSelectedEvent): void {
    this.servicio = event.option.value as Servicio;
    this.id = this.servicio.id;
    // console.log('seleciono producto: ');
    // console.log(this.producto);
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }
  abrirModal(servicio: Servicio) {
    this.servicioSelecionado = servicio;
    this.modalServicioService.abrirModal();
  }

  cerrarModalBusquedaServicio() {
    this.modalServicioBuscarService.cerrarModal();
    this.servicio = null;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
}

