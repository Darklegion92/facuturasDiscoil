import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable()
export class UserService {
private urlEndPoint: string;
// private urlEndPoint = `http://localhost:3001/usuario`;
constructor(private http: HttpClient,
            private router: Router,
            private funcionesService: FuncionesService
            ) {
              this.urlEndPoint = `${this.funcionesService.configuracionUrlApi()}/usuario` ;
            }

    public getUsers(): Observable<User[]> {
      const credenciales = sessionStorage.getItem('token');
      const httpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // tslint:disable-next-line: object-literal-key-quotes
        'autorizacion': 'Basic ' + credenciales
      });
      return this.http.get<User[]>(`${this.urlEndPoint}`, { headers: httpHeaders });
    }

  create(user: User): Observable<any> {
   const credenciales = sessionStorage.getItem('token');
   const httpHeaders = new HttpHeaders({
     'Content-Type': 'application/x-www-form-urlencoded',
     // tslint:disable-next-line: object-literal-key-quotes
     'autorizacion': 'Basic ' + credenciales
   });
   //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
   return this.http.post<User>(this.urlEndPoint, user, { headers: httpHeaders });
  }

  getUser(id): Observable<User> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/login']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(user: User): Observable<User> {
    const credenciales = sessionStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // tslint:disable-next-line: object-literal-key-quotes
      'autorizacion': 'Basic ' + credenciales
    });
    //  return this.http.get<User>(`${this.urlEndPoint}/${id}`, { headers: httpHeaders } ).pipe(
    return this.http.put(
      `${this.urlEndPoint}`,
      user, { headers: httpHeaders }).pipe(
        map((response: any ) => response.user as User),
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
  delete(id: number): Observable<User> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.user as User ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }


}
