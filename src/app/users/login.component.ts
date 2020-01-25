import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  usuario: User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new User();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      Swal.fire(
        '¡Informacion!',
        `Hola ${this.authService.usuario.username}, ya estás autenticado!`,
        'info'
      );
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    //  console.log(this.usuario);
    // console.log('trae : ' + this.usuario.username);
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
    this.authService.login(this.usuario).subscribe(response => {
      // console.log(response);
      // const payload = JSON.parse(atob(response.access_token.split('.')[1]));
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      const usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      Swal.fire(
        'Bienvenido',
        `hola ${usuario.username}, has iniciado sesion con exito!`,
        'success'
      );
    }, err => {
      if (err.status === 400) {
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
