import { Injectable } from '@angular/core';
import { Region } from './region';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';

import { Router } from '@angular/router';



@Injectable()
export class RegionService {

private urlEndPoint = `http://localhost:8080/api/regiones`;

constructor(private http: HttpClient,
            private router: Router) { }

 public getRegiones(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('RegionService: tap 1');
           (response.content as Region[]).forEach(region => {
           //  console.log(region.nombre);
           });
          }),
          map((response: any ) => {
            (response.content as Region[]).map( region => {
              region.nombre = region.nombre.toUpperCase();
              return region;
          });
            return response;
          }),
          tap(response => {
            //  console.log('RegionService: tap2');
            (response.content as Region[]).forEach(region => {
            //  console.log(region.nombre);
            });
         }));

  }

  public getRegionLista(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint);
  }

  create(region: Region): Observable<Region> {
    return this.http.post(this.urlEndPoint, region).pipe(
      map((response: any ) => response.region as Region ),
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

  getRegion(id): Observable<Region> {
    return this.http.get<Region>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/regiones']);
          console.error(e.error.mensaje);
        }
        this.router.navigate(['/regiones']);
        return throwError(e);
      })
    );
  }

  update(region: Region): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${region.id}`,
      region).pipe(
        map((response: any ) => response.region as Region ),
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

  delete(id: number): Observable<Region> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.region as Region ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }



}
