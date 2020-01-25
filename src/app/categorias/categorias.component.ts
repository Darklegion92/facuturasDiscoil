import { Component, OnInit } from '@angular/core';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalCategoriaService  } from './detalle-categoria/modal-categoria.service';
import { AuthService } from './../users/auth.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[];
  paginador: any;
  categoriaSelecionado: Categoria;
  constructor(
    private categoriaService: CategoriaService,
    public modalCategoriaService: ModalCategoriaService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.categoriaService.getCategorias(page)
    .pipe(
      tap( response => {
        // console.log('CategoriaComponent: tap 3');
        (response.content as Categoria[]).forEach(categoria => {
        //  console.log(categoria.nombre);
        });
      })
    ).subscribe(response => {
      this.categorias = response.content as Categoria[];
      this.paginador = response;
    });
    });
  }
  delete(categoria: Categoria): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar La Categoria ${categoria.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Categoria!'
    }).then((result) => {
      if (result.value) {
          this.categoriaService.delete(categoria.id).subscribe(
            response => {
              this.categorias = this.categorias.filter(cli => cli !== categoria);
              Swal.fire(
                'Borrado!',
                `Categoria ${categoria.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }
  abrirModal(categoria: Categoria) {
    this.categoriaSelecionado = categoria;
    this.modalCategoriaService.abrirModal();
  }

}

