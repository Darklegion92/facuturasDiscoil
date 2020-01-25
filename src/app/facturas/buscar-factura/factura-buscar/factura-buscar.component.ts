import { Component, OnInit } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith, flatMap } from 'rxjs/operators';
import { ModalFacturaBuscarService } from './../../services/modal-factura-buscar.service';
import { Factura } from './../../models/factura';
import { FacturaService } from './../../services/factura.service';
import { FuncionesService } from './../../../generales/funciones.service';
import { AuthService } from './../../../users/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-factura-buscar',
  templateUrl: 'factura-buscar.component.html',
  styleUrls: ['factura-buscar.component.css']
})
export class FacturaBuscarComponent implements OnInit {
  id: number;
  factura: Factura;
  facturaLista: Factura[];
  titulo = 'Buscar Factura';
  facturaSelecionado: Factura;
  facturaFiltrados: Observable<Factura[]>;
  autocompleteControl = new FormControl();

  constructor(
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    public funcionesService: FuncionesService,
    public facturaService: FacturaService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.facturaFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Factura[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarFacturas(filterValue);
  }

  mostrarNombre(factura?: Factura): string | undefined {
    return factura ? factura.descripcion : undefined;
  }

  seleccionarFactura(event: MatAutocompleteSelectedEvent): void {
    this.factura = event.option.value as Factura;
    this.id = this.factura.id;
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  cerrarModalBusquedaFactura() {
    this.modalFacturaBuscarService.cerrarModal();
    this.factura = null;
  }

  buscarFactura() {
    const condigoFactura =  document.getElementById('codigoFactura') as HTMLInputElement;
    // console.log(condigoFactura.value);
    if ( condigoFactura.value === '') {
      Swal.fire({
        title: 'Error...',
        text: 'Favor ingresar un numero de factura valido',
        footer: 'Solo *Numeros* en este campo</a>'
      });
    } else {
      const numFactura = +(condigoFactura.value);
      this.facturaService.getFactura(numFactura).subscribe(factura => this.factura = factura);

    }
    // console.log(factura.id);
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}

