import { Component, OnInit, Input } from '@angular/core';
import { Servicio } from '../servicio';
import { ServicioService  } from '../servicio.service';
import { ModalServicioService  } from './modal-servicio.service';
import { AuthService } from './../../users/auth.service';
import { ModalServicioBuscarService } from './servicio-buscar/modal-servicio-buscar.service';
import { FuncionesService } from './../../generales/funciones.service';


@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css']
})
export class DetalleServicioComponent implements OnInit {

  @Input() servicio: Servicio;
  titulo = 'Detalle Servicio';


  constructor(
    private servicioService: ServicioService,
    public modalServicioService: ModalServicioService,
    public modalServicioBuscarService: ModalServicioBuscarService,
    public authService: AuthService,
    private funcionesService: FuncionesService,
   ) { }

  ngOnInit() {

  }

  cerrarModal() {
    this.modalServicioService.cerrarModal();
    this.modalServicioBuscarService.cerrarModal();
    this.servicio = null;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}

