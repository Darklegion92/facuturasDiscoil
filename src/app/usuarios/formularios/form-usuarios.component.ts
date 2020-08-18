import { UserService } from 'src/app/usuarios/services/user.service';
import { User } from '../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService } from '../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl,
         FormGroupDirective,
         NgForm, Validators,
         FormBuilder, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-usuarios.component.html'
})


export class FormUsuariosComponent implements OnInit {

  formularioCreado: FormGroup;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  usuario: User = new User();
  titulo = 'Crear Cliente';
  errores: string[];
  rol = 'admin';
  estado = false;

  constructor(
              private clienteService: ClienteService,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public loadingService: LoadingService,
              public formBuilder: FormBuilder
              ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.crearFormulario();
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.estado = true;
            this.userService.getUser(id).subscribe(
            (usuario) => {this.usuario = usuario,
                          this.asignarDatosFormulario();
            });
        }
      });
    // this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
    this.loadingService.cerrarModal();
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    this.userService.create(this.usuario).subscribe(response => {
      if (response.status === 200) {
        this.loadingService.abrirModal();
        this.router.navigate(['/usuarios']),
         Swal.fire({
           type: 'success',
           title: 'Nuevo Usuario',
           text: `${this.usuario.nombre} `,
           footer: 'Creado con Exito!',
           });
      } else {
        this.loadingService.abrirModal();
      }
    }
     );
  }

  update(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    this.userService.update(this.usuario)
    .subscribe(
      usuario => {
        this.router.navigate(['/usuarios']),
        Swal.fire({
          type: 'success',
          title: 'Usuario',
          text: `${this.usuario.nombre} `,
          footer: 'Actualizado con Exito!',
          });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        this.loadingService.cerrarModal();
        console.error(err);
      }
    );
  }

  // tratamiento a formulario
  crearFormulario() {
    this.formularioCreado = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      nombre: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      apellido: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      documento: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10)
      ])],
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      celular1: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ])],
      direccion: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      roles: ['prueba', Validators.required],
      // region: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  asignarDatosFormulario() {
    if (this.usuario.roles.length < 2 ) {
        this.rol = 'user';
    }
    this.formularioCreado.setValue({
      password: '',
      username: this.usuario.username,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      documento: this.usuario.documento,
      email: this.usuario.email,
      celular1: this.usuario.celular1,
      direccion: this.usuario.direccion,
      // region: this.usuario.region,
      fecha: this.usuario.fecha,
      roles: this.rol,

    });
  }

  asignarDatosParaGuardar() {
    this.usuario.username = this.formularioCreado.value.username,
    this.usuario.password = this.formularioCreado.value.password,
    this.usuario.nombre = this.formularioCreado.value.nombre,
    this.usuario.apellido = this.formularioCreado.value.apellido,
    this.usuario.documento = this.formularioCreado.value.documento ,
    this.usuario.email = this.formularioCreado.value.email,
    this.usuario.celular1 = this.formularioCreado.value.celular1,
    this.usuario.direccion = this.formularioCreado.value.direccion,
    this.usuario.fecha = this.formularioCreado.value.fecha;
    if (this.formularioCreado.value.roles === 'admin') {
      this.usuario.roles = ['ROLE_ADMIN', 'ROLE_USER'];
    } else {
      this.usuario.roles = ['ROLE_USER'];
    }
    // this.usuario.region = this.formularioCreado.value.region;
  }

}
