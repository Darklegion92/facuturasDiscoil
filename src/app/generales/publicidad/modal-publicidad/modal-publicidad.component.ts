import { ModalPublicidadService } from './../../../users/services/modal-publicidad.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-publicidad',
  templateUrl: './modal-publicidad.component.html',
  styleUrls: ['../../css/modal.css']
})
export class ModalPublicidadComponent implements OnInit {
  titulo = 'Publicidad';
  constructor( public modalPublicidadService: ModalPublicidadService ) { }


  ngOnInit() {

  }
  cerrarModal() {
    this.modalPublicidadService.cerrarModal();
  }
}
