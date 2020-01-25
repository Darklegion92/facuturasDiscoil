import { Component, OnInit, Input } from '@angular/core';
import { Region } from '../region';
import { RegionService  } from '../region.service';
import { HttpEventType } from '@angular/common/http';
import { ModalRegionService  } from './modal-region.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-region',
  templateUrl: './detalle-region.component.html',
  styleUrls: ['./detalle-region.component.css']
})
export class DetalleRegionComponent implements OnInit {

  @Input() region: Region;
  titulo = 'Detalle Barrio';
  private fotoSelecionada: File;
  progreso = 0;
  constructor(
    private regionService: RegionService,
    public modalRegionService: ModalRegionService,
   ) { }

  ngOnInit() {

  }


  cerrarModal() {
    this.modalRegionService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
