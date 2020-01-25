import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable()
export class UserService {
private urlEndPoint = `http://localhost:8080/api/users`;

constructor(private http: HttpClient,
            private router: Router,
            ) { }

    public getUsers(page: number): Observable<any> {
        return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
          tap((response: any) => {
          // console.log('UserService: tap 1');
          (response.content as User[]).forEach(user => {
          // console.log(user.nombre);
          });
          }),
          map((response: any ) => {
             (response.content as User[]).map( user => {
              user.nombre = user.nombre.toUpperCase();
              return user;
            });
             return response;
        }),
        tap(response => {
           // console.log('UserService: tap2');
           (response.content as User[]).forEach(user => {
          // console.log(user.nombre);
        });
           }));
    }

  create(user: User): Observable<User> {
   return this.http.post<User>(this.urlEndPoint, user).pipe(
      map((response: any ) => response.user as User ),
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
  getUser(id): Observable<User> {
    return this.http.get<User>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/users']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }
  update(user: User): Observable<User> {
    return this.http.put(
      `${this.urlEndPoint}/${user.id}`,
      user).pipe(
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

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST',  `${this.urlEndPoint}/uploadimguser`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  //  public getRolesLista(): Observable<Role[]> {
  //    return this.http.get<Role[]>(`${this.urlEndPoint}/roles`);
  //  }

}
