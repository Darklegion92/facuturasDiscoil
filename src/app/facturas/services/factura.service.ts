import { Injectable } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint = 'http://192.168.1.50:3001';

  constructor(private http: HttpClient) { }

  public getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/pedidos/`);
  }


  getFactura(id: string): Observable<Factura> {
    console.log('este servicio es');
    console.log('llego con id ' + id);
    return this.http.get<Factura>(`${this.urlEndPoint}/pedidos/${id}`);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  create(factura: Factura): Observable<Factura> {
    console.log('mostra facura');
    console.log(factura);
    return this.http.post<Factura>(`${this.urlEndPoint}/pedidos/guardar`, factura);
  }

  createFactura(factura: Factura): Observable<Factura> {
    console.log('metodo 2');
    console.log(factura);
    return this.http.post(`${this.urlEndPoint}/pedidos/guardar`, factura).pipe(
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

  //  cambiaFactura(factura: Factura): Observable<Factura> {
  //   console.log('mostra facura');
  //   console.log(factura);
  //   return this.http.post<Factura>(`${this.urlEndPoint}/pedidos/guardar`, factura);
  //  }

    cambiaEstadoFactura(id: string, estado: string): Observable<Factura> {
      // return this.http.get<Factura>(`${this.urlEndPoint}/pedidos/${id}`);
      console.log('llego a cambiar' + id);
      return this.http.get<Factura>(`${this.urlEndPoint}/pedidos/${estado}/${id}`);
    }

  filtrarFacturas(term: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/filtrar-facturas/${term}`);
  }

  getFiltrarFacturasPorFecha(term1: string, term2: string): Observable<Factura[]> {
      return this.http.get<Factura[]>(`${this.urlEndPoint}/pedidos/filtro?fechainicial=${term1}&fechafinal=${term2}`);
  }

}
