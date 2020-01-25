import { Component, OnInit, Input } from '@angular/core';
import { Categoria } from '../categoria';
import { CategoriaService  } from '../categoria.service';
 // import { HttpEventType } from '@angular/common/http';
import { ModalCategoriaService  } from './modal-categoria.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.component.html',
  styleUrls: ['./detalle-categoria.component.css']
})
export class DetalleCategoriaComponent implements OnInit {

  @Input() categoria: Categoria;
  titulo = 'Detalle Categoria';
  private fotoSelecionada: File;
  progreso = 0;
  constructor(
    private categoriaService: CategoriaService,
    public modalCategoriaService: ModalCategoriaService,
   ) { }

  ngOnInit() {

  }


  cerrarModal() {
    this.modalCategoriaService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
