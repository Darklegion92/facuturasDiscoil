import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  usuario: User;
  private rol = 'USUARIO';

  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService,
  ) {
    this.usuario = new User();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        type: 'info',
        title: '¡Informacion!',
        text: `Hola ${this.authService.usuario.username}`,
        footer: 'ya estás autenticado!',
        });
      this.loadingService.cerrarModal();
      this.router.navigate(['/clientes/perfil']);
    }
  }

  login(): void {
    if (this.usuario.username === null || this.usuario.password === null
          || this.usuario.username === undefined || this.usuario.password === undefined ) {
            Swal.fire({
              type: 'error',
              title: 'Error al Logear',
              text: 'El Usuario o el Password vacios',
              footer: 'Intente de nuevo',
              });
            return;
    }
    this.loadingService.abrirModal();
    this.authService.login(this.usuario).subscribe(response => {
      if (response.status === 200) {
        this.loadingService.abrirModal();
        this.authService.guardarUsuario(response.usuario);
        this.authService.guardarToken(response.token);
        const usuario = this.authService.usuario;
        if (this.authService.hasRole('ROLE_ADMIN')) {
          this.rol = 'ADMINISTRADOR';
        }
        this.loadingService.cerrarModal();
        Swal.fire({
          type: 'success',
          title: 'Bienvenido',
          text: `hola ${usuario.username}, has iniciado sesion con exito!`,
          footer: `Rol  ---${this.rol}--- `,
          });
        this.router.navigate(['/clientes/perfil']);
      } else {
          this.loadingService.cerrarModal();
          Swal.fire({
            type: 'error',
            title: 'Error al Logear',
            text: response.mensaje,
            footer: 'Intente de nuevo',
            });
      }
      // const payload = JSON.parse(atob(response.access_token.split('.')[1]));
    }, err => {
      if (err.status === 400) {
        this.loadingService.cerrarModal();
        Swal.fire({
          type: 'error',
          title: 'Error al Logear',
          text: 'El Usuario o el Password Incorrectos',
          footer: 'Intente de nuevo',
          });
      }
    });
  }

}
