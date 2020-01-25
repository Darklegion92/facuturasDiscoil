import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';
import { Region } from '../regiones/region';
import { RegionService } from '../regiones/region.service';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html'
})
export class FormUserComponent implements OnInit {

  user: User = new User();
  regiones: Region[];
  // roles: string;
  titulo = 'Crear Usuarios';
  errores: string[];
  // admin = false;
  // usuario = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.cargarUser();
  }
  cargarUser(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.userService.getUser(id).subscribe(
            user =>  this.user = user
          );
          // this.userService.getUser(id).subscribe(
          //   (user) => { this.user = user;
          //               console.log(this.user.roles.length);
          //               if (this.user.roles.length === 1) {
          //                   this.usuario = true;
          //               } else {
          //                 this.admin = true;
          //                 this.usuario = true;
          //               }
          //   });
        }
      });
    this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
    // this.userService.getRolesLista()
    //   .subscribe(
    //     roles => {this.roles = roles;
    //               this.roles.forEach(datos => {
    //                console.log('deberia mostrarme los roles');
    //                console.log(datos);
    //       });
    //       });
  }

  public create(): void {
    this.userService.create(this.user).subscribe(
      user => {
        this.router.navigate(['/users']),
        Swal.fire(
          'Nuevo Usuario,',
          `${user.nombre}, creado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  update(): void {
    this.userService.update(this.user)
    .subscribe(
      user => {
        this.router.navigate(['/users']),
        // console.log(this.user),
        Swal.fire(
          'Usuario,',
          `${this.user.nombre}, Actualizado con Exito!`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  public compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
