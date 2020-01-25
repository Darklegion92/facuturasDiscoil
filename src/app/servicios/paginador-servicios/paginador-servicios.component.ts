import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginador-servicios',
  templateUrl: './paginador-servicios.component.html'

})
export class PaginadorServiciosComponent implements OnInit, OnChanges {

  @Input() paginador: any;
  desde: number;
  hasta: number;


  paginas: number [];
  constructor() { }
  ngOnInit() {  }

  ngOnChanges() {
    this.desde = Math.min(
                  Math.max(1, this.paginador.number - 4),
                  this.paginador.totalPages - 5);
    this.hasta = Math.max(
                  Math.min(this.paginador.totalPages,
                    this.paginador.number + 4), 6);

    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1 ).fill(0).map(
        // tslint:disable-next-line: variable-name
        (_valor, indice) => indice + this.desde);

    } else {
    // tslint:disable-next-line: variable-name
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }
}

