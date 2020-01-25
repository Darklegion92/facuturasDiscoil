import { Injectable } from '@angular/core';
import { Factura } from '../models/factura';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) { }

  public getFacturas(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('FacturaService: tap 1');
           (response.content as Factura[]).forEach(factura => {
            // console.log(factura.descripcion);
           });
          }),
          map((response: any ) => {
            (response.content as Factura[]).map( factura => {
              factura.nombre = factura.descripcion.toUpperCase();
              return factura;
          });
            return response;
          }),
          tap(response => {
            // console.log('FacturaService: tap2');
            (response.content as Factura[]).forEach(factura => {
            //  console.log(factura.descripcion);
            });
         }));
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  create(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post(this.urlEndPoint, factura).pipe(
      map((response: any ) => response.factura as Factura ),
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

  filtrarFacturas(term: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/filtrar-facturas/${term}`);
  }

  getFiltrarFacturasPorFecha(term1: string, term2: string): Observable<Factura[]> {
      console.log('entro al metodo nuevo');
      return this.http.get<Factura[]>(`${this.urlEndPoint}/fecha1/${term1}/fecha2/${term2}`);
    }
  // getFiltrarFacturasPorFecha(term1: string): Observable<Factura[]> {
  //   console.log('entro al metodo nuevo: ' + term1);
  //   return this.http.get<Factura[]>(`${this.urlEndPoint}/fecha/${term1}`);
  // }
}
