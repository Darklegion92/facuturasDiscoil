import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { HttpClient,  HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private funcionesService: FuncionesService) {
                this.urlEndPoint = `${this.funcionesService.configuracionUrlApi()}`;
               }

  public getFacturas(): Observable<Factura[]> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    return this.http.get<Factura[]>(`${this.urlEndPoint}/pedidos/`, { headers: httpHeaders });
  }


  getFactura(id: string): Observable<Factura> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    return this.http.get<Factura>(`${this.urlEndPoint}/pedidos/${id}`, { headers: httpHeaders });
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  create(factura: Factura): Observable<Factura> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    return this.http.post<Factura>(`${this.urlEndPoint}/pedidos/guardar`, factura, { headers: httpHeaders });
  }

  createFactura(factura: Factura): Observable<Factura> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    return this.http.post(`${this.urlEndPoint}/pedidos/guardar`, factura, { headers: httpHeaders }).pipe(
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



    cambiaEstadoFactura(id: string, estado: string): Observable<Factura> {
      const credenciales = sessionStorage.getItem('token');
      const httpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // tslint:disable-next-line: object-literal-key-quotes
        'autorizacion': 'Basic ' + credenciales
      });
      //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
      return this.http.get<Factura>(`${this.urlEndPoint}/pedidos/${estado}/${id}`, { headers: httpHeaders });
    }

  filtrarFacturas(term: string): Observable<Factura[]> {
   const credenciales = sessionStorage.getItem('token');
   const httpHeaders = new HttpHeaders({
     'Content-Type': 'application/x-www-form-urlencoded',
     // tslint:disable-next-line: object-literal-key-quotes
     'autorizacion': 'Basic ' + credenciales
   });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
   return this.http.get<Factura[]>(`${this.urlEndPoint}/filtrar-facturas/${term}`, { headers: httpHeaders });
  }

  getFiltrarFacturasPorFecha(term1: string, term2: string): Observable<Factura[]> {
   const credenciales = sessionStorage.getItem('token');
   const httpHeaders = new HttpHeaders({
     'Content-Type': 'application/x-www-form-urlencoded',
     // tslint:disable-next-line: object-literal-key-quotes
     'autorizacion': 'Basic ' + credenciales
   });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
   return this.http.get<Factura[]>(`${this.urlEndPoint}/pedidos/filtro?fechainicial=${term1}&fechafinal=${term2}`,
     { headers: httpHeaders });
  }

}
