import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalClienteService  } from './detalle-cliente/modal-cliente.service';
import { AuthService } from './../users/auth.service';
import { ModalFacturaService } from './../facturas/services/modalFactura.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})

export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSelecionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    public modalClienteService: ModalClienteService,
    public modalFacturaService: ModalFacturaService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) {
    }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.clienteService.getClientes(page)
    .pipe(
      tap( response => {
        // console.log('ClientesComponent: tap 3');
        (response.content as Cliente[]).forEach(cliente => {
        //  console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
      });
    });
    this.modalClienteService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map( clienteOriginal => {
        if (cliente.id === clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });

  }
  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar Al Cliente ${cliente.nombre} ${cliente.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Cliente!'
    }).then((result) => {
      if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente);
              Swal.fire(
                'Borrado!',
                `Cliente ${cliente.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }
  abrirModal() {
    this.modalFacturaService.abrirModal();
  }

}
