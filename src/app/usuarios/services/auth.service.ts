import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlBase: string;
  // tslint:disable-next-line: variable-name
  private _usuario: User;
  // tslint:disable-next-line: variable-name
  private _token: string;

  constructor(private http: HttpClient,
              private funcionesService: FuncionesService
    ) {
      this.urlBase = this.funcionesService.configuracionUrlApi();
    }

  public get usuario(): User {
    // console.log('deberia mostrar el usuario');
    // console.log(this._usuario);
    if (this._usuario != null) {
        return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as User;
      return this._usuario;
    }
    // console.log('auth.service');
    // console.log('retornara un usuario vacio no encontro usuario');
    return new User();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: User): Observable<any> {
      const urlEndpoint = `${this.urlBase}/usuario/login`;
      console.log(urlEndpoint);
      // btoa encripta con base64
      const credenciales = btoa('angularapp' + ':' + '12345');
      const httpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // tslint:disable-next-line: object-literal-key-quotes
        'Authorization': 'Basic ' + credenciales
      });
      const params = new URLSearchParams();
      params.set('grant_type', 'password');
      params.set('username', usuario.username);
      params.set('password', usuario.password);
      // console.log(params.toString());
      return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(payload: User): void {
    // let payload = this.obtenerDatosToken(payload);
    this._usuario = new User();
    this._usuario._id = payload._id;
    this._usuario.nombre = payload.nombre;
    this._usuario.email = payload.email;
    this._usuario.username = payload.username;
    this._usuario.telefono = payload.telefono;
    this._usuario.direccion = payload.direccion;
    this._usuario.createAt = payload.createAt;
    this._usuario.documento = payload.documento;
    this._usuario.estado = payload.estado;
    this._usuario.roles = payload.roles;
    // console.log('auth.service');
    // console.log(this._usuario.roles);
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    // console.log('entro a gaurdar token');
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    // console.log('entro a sacar token token');
    if (accessToken != null) {
      // console.log('encontro un token');
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    const payload = this.obtenerDatosToken(this.token);
    // console.log('metodo autenticado');
    // console.log(payload);
    // if (payload != null && payload.user_name && payload.user_name.length > 0) {
    if (payload != null && payload.usr && payload.usr.length > 0) {
      // console.log('esta autenticado-auth.service');
      return true;
    }
    return false;
  }

  getUsuarioLogeado() {
   return sessionStorage.getItem('usuario');
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}


