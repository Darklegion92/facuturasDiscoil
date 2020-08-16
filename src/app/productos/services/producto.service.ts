import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ProductoService {
private urlEndPoint: string;


constructor(private http: HttpClient,
            private router: Router,
            private funcionesService: FuncionesService
            ) {
              this.urlEndPoint = `${this.funcionesService.configuracionUrlApi()}`;
            }

            public getProductos(page: number): Observable<any> {
              const credenciales = sessionStorage.getItem('token');
              const httpHeaders = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                // tslint:disable-next-line: object-literal-key-quotes
                'autorizacion': 'Basic ' + credenciales
              });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
              return this.http.get(this.urlEndPoint + '/page/' + page, { headers: httpHeaders }).pipe(
                tap((response: any) => {
                     // console.log('ProductoService: tap 1');
                     (response.content as Producto[]).forEach(producto => {
                      // console.log(producto.nombre);
                     });
                    }),
                    map((response: any ) => {
                      (response.content as Producto[]).map( producto => {
                        producto.nombre = producto.nombre.toUpperCase();
                        return producto;
                    });
                      return response;
                    }),
                    tap(response => {
                      // console.log('ProductoService: tap2');
                      (response.content as Producto[]).forEach(producto => {
                       // console.log(producto.nombre);
                      });
                   }
                )
              );
            }

  create(producto: Producto): Observable<Producto> {
    return this.http.post(this.urlEndPoint, producto).pipe(
      map((response: any ) => response.producto as Producto ),
      catchError (e => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          Swal.fire({
            type: 'error',
            title: e.error.mensaje,
            text: `Ya existe un producto Con este 'Nombre'`,
          });
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getProducto(id): Observable<Producto> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders }).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(producto: Producto): Observable<Producto> {
    return this.http.put(
      `${this.urlEndPoint}/${producto.id}`,
      producto).pipe(
        map((response: any ) => response.producto as Producto ),
        catchError (e => {
          if (e.status === 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            Swal.fire({
              type: 'error',
              title: e.error.mensaje,
              text: `Ya existe un producto Con este 'Nombre'`,
            });
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Producto> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.producto as Producto ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST',  `${this.urlEndPoint}/uploadimgproducto`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
    return this.http.get<Producto[]>(`${this.urlEndPoint}/articulos/consultar/${term}`, { headers: httpHeaders });
  }


  filtrarClientes(term: string): Observable<Producto[]> {
    console.log('ingreso a filtrarClientes');
    return this.http.get<Producto[]>(`${this.urlEndPoint}/articulos/consultar/${term}`);
  }

}
