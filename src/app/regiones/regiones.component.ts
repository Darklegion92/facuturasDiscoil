import { Component, OnInit } from '@angular/core';
import { Region } from './region';
import { RegionService } from './region.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalRegionService  } from './detalle-region/modal-region.service';
import { AuthService } from './../users/auth.service';


@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.component.html'
})

export class RegionesComponent implements OnInit {
   regiones: Region[];
  paginador: any;
  regionSelecionado: Region;
  constructor(
    private regionService: RegionService,
    public modalRegionService: ModalRegionService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) {
    }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.regionService.getRegiones(page)
    .pipe(
      tap( response => {
        // console.log('RegionesComponent: tap 3');
        (response.content as Region[]).forEach(region => {
        //  console.log(region.nombre);
        });
      })
    ).subscribe(response => {
      this.regiones = response.content as Region[];
      this.paginador = response;
      });
    });
  }
  delete(region: Region): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar el Barrio ${region.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Barrio!'
    }).then((result) => {
      if (result.value) {
          this.regionService.delete(region.id).subscribe(
            response => {
              this.regiones = this.regiones.filter(reg => reg !== region);
              Swal.fire(
                'Borrado!',
                `Barrio ${region.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }
  abrirModal(region: Region) {
    this.regionSelecionado = region;
    this.modalRegionService.abrirModal();
  }

}

