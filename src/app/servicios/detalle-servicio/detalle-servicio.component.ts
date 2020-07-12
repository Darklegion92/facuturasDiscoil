import { Component,  Input } from '@angular/core';
import { Servicio } from '../interfaces/servicio';
import { ServicioService  } from '../services/servicio.service';
import { ModalServicioService  } from '../services/modal-servicio.service';
import { AuthService } from '../../users/services/auth.service';
import { ModalServicioBuscarService } from '../services/modal-servicio-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';


@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['../../generales/css/modal.css']
})
export class DetalleServicioComponent {

  @Input() servicio: Servicio;
  titulo = 'Detalle Servicio';

  constructor(
    private servicioService: ServicioService,
    public modalServicioService: ModalServicioService,
    public modalServicioBuscarService: ModalServicioBuscarService,
    public authService: AuthService,
    private funcionesService: FuncionesService,
   ) { }

  cerrarModal() {
    this.modalServicioService.cerrarModal();
    this.modalServicioBuscarService.cerrarModal();
    this.servicio = null;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}

