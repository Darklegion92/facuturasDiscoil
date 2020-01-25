import { Component } from '@angular/core';
import { AuthService } from '../users/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {


  constructor(public authService: AuthService, private router: Router) { }
  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire(
      '¡Informacion!',
       `Hasta pronto ${username}, has cerrado sesión con éxito!`,
      'info'
    );
    this.router.navigate(['/login']);
  }
}
