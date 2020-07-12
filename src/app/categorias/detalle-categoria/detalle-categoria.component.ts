import { Component, Input } from '@angular/core';
import { Categoria } from '../interfaces/categoria';
import { CategoriaService  } from '../services/categoria.service';
import { ModalCategoriaService  } from '../services/modal-categoria.service';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class DetalleCategoriaComponent  {

  @Input() categoria: Categoria;
  titulo = 'Detalle Categoria';
  private fotoSelecionada: File;
  progreso = 0;
  constructor(
    private categoriaService: CategoriaService,
    public modalCategoriaService: ModalCategoriaService,
   ) { }

  cerrarModal() {
    this.modalCategoriaService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
