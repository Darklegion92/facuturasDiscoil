import { Injectable } from '@angular/core';
import { Servicio } from '../interfaces/servicio';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ServicioService {
private urlEndPoint = `http://localhost:8080/api/servicios`;


constructor(private http: HttpClient,
            private router: Router,
            ) { }

            public getServicios(page: number): Observable<any> {
              return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
                tap((response: any) => {
                     // console.log('servicioService: tap 1');
                     (response.content as Servicio[]).forEach(servicio => {
                      // console.log(servicio.nombre);
                     });
                    }),
                    map((response: any ) => {
                      (response.content as Servicio[]).map( servicio => {
                        servicio.nombre = servicio.nombre.toUpperCase();
                        return servicio;
                    });
                      return response;
                    }),
                    tap(response => {
                      // console.log('ServicioService: tap2');
                      (response.content as Servicio[]).forEach(servicio => {
                       // console.log(servicio.nombre);
                      });
                   }
                )
              );
            }
  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post(this.urlEndPoint, servicio).pipe(
      map((response: any ) => response.servicio as Servicio ),
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

  getServicio(id): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/servicios']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put(
      `${this.urlEndPoint}/${servicio.id}`,
      servicio).pipe(
        map((response: any ) => response.servicio as Servicio ),
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

  delete(id: number): Observable<Servicio> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.servicio as Servicio ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

   filtrarServicios(term: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.urlEndPoint}/filtrar-servicios/${term}`);
  }


  // filtrarClientes(term: string): Observable<Servicio[]> {
  //   return this.http.get<Servicio[]>(`${this.urlEndPoint}/filtrar-servicios/${term}`);
  // }

}

