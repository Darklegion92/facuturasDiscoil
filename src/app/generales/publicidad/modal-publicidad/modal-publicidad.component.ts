import { FuncionesService } from './../../services/funciones.service';
import { ModalPublicidadService } from '../../../usuarios/services/modal-publicidad.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-publicidad',
  templateUrl: './modal-publicidad.component.html',
  styleUrls: ['./modal.css']
})
export class ModalPublicidadComponent implements OnInit {
  rutaImgPublicidad: string;
  titulo = 'Publicidad';
  constructor(  public modalPublicidadService: ModalPublicidadService,
                private funcionesService: FuncionesService ) {
    this.rutaImgPublicidad = `${this.funcionesService.configuracionUrlApi()}/img/Login.png`;
  }


  ngOnInit() {

  }
  cerrarModal() {
    this.modalPublicidadService.cerrarModal();
  }
}
