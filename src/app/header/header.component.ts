import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit{
 estado: boolean;
  constructor(
    public authService: AuthService, private router: Router
    ) { }

    ngOnInit() {
      if (sessionStorage.getItem('usuario') != null) {
        this.estado = true;
      }
    }
  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire({
      type: 'info',
      title: '¡Informacion!',
      text: `Hasta pronto ${username}`,
      footer: 'Has cerrado sesión con éxito!',
      });
    this.router.navigate(['/login']);
  }
}
