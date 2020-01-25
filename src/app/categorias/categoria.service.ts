import { Injectable } from '@angular/core';
import { Categoria } from './categoria';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class CategoriaService {
private urlEndPoint = `http://localhost:8080/api/categorias`;


constructor(private http: HttpClient,
            private router: Router,
            ) { }

          public getCategorias(page: number): Observable<any> {
              return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
                tap((response: any) => {
                     // console.log('CategoriaService: tap 1');
                     (response.content as Categoria[]).forEach(categoria => {
                      // console.log(categoria.nombre);
                     });
                    }),
                    map((response: any ) => {
                      (response.content as Categoria[]).map( categoria => {
                        categoria.nombre = categoria.nombre.toUpperCase();
                        return categoria;
                    });
                      return response;
                    }),
                    tap(response => {
                      // console.log('CategoriaService: tap2');
                      (response.content as Categoria[]).forEach(categoria => {
                      //  console.log(categoria.nombre);
                      });
                   }
                )
              );
            }
  public getCategoriaLista(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(this.urlEndPoint);
  }

  create(categoria: Categoria): Observable<Categoria> {

    return this.http.post(this.urlEndPoint, categoria).pipe(
      map((response: any ) => response.categoria as Categoria ),
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
  getCategoria(id): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/categorias']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }
  update(categoria: Categoria): Observable<Categoria> {
    return this.http.put(
      `${this.urlEndPoint}/${categoria.id}`,
      categoria).pipe(
        map((response: any ) => response.categoria as Categoria ),
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
  delete(id: number): Observable<Categoria> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.Categoria as Categoria ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

}

