import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ProductoService {
private urlEndPoint = `http://localhost:8080/api/productos`;


constructor(private http: HttpClient,
            private router: Router,
            ) { }

            public getProductos(page: number): Observable<any> {
              return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
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
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getProducto(id): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
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
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }


  filtrarClientes(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }

}