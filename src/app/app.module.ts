import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import { ClientesComponent } from './clientes/clientes.component';

import { ClienteService } from './clientes/cliente.service';
import { CategoriaService } from './categorias/categoria.service';
import { ServicioService } from './servicios/servicio.service';
import { UserService } from './users/user.service';
import { ProductoService } from './productos/producto.service';
import { RegionService } from './regiones/region.service';

import { UsersComponent } from './users/users.component';
import { ProductosComponent } from './productos/productos.component';
import { FormClienteComponent } from './clientes/form-cliente.component';
import { FormUserComponent } from './users/form-user.component';
import { FormProductoComponent } from './productos/form-producto.component';
import { registerLocaleData } from '@angular/common';

import { PaginadorClientesComponent } from './clientes/paginador-clientes/paginador-clientes.component';
import { PaginadorProductosComponent } from './productos/paginador-productos/paginador-productos.component';
import { PaginadorUsersComponent } from './users/paginador-users/paginador-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DetalleUserComponent } from './users/detalle-user/detalle-user.component';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';
import { RegionesComponent } from './regiones/regiones.component';
import { FormRegionesComponent } from './regiones/form-regiones.component';
import { PaginadorRegionesComponent } from './regiones/paginador-regiones/paginador-regiones.component';
import { DetalleRegionComponent } from './regiones/detalle-region/detalle-region.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { FormCategoriasComponent } from './categorias/form-categorias.component';
import { DetalleCategoriaComponent } from './categorias/detalle-categoria/detalle-categoria.component';
import { PaginadorCategoriasComponent } from './categorias/paginador-categorias/paginador-categorias.component';
import { LoginComponent } from './users/login.component';
import { AuthGuard } from './users/guards/auth.guard';
import { RoleGuard } from './users/guards/role.guard';
import { TokenInterceptor } from './users/interceptors/token.interceptor';
import { AuthInterceptor } from './users/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ListaFacturasComponent } from './facturas/lista-facturas/lista-facturas.component';
import { PaginadorFacturasComponent } from './facturas/paginador-facturas/paginador-facturas.component';
import { ClienteFacturarComponent } from './facturas/cliente-facturar/cliente-facturar.component';
import { ProductoBuscarComponent } from './productos/detalle-producto/producto-buscar/producto-buscar.component';
import { FacturaBuscarComponent } from './facturas/buscar-factura/factura-buscar/factura-buscar.component';
import { FiltrarFacturasComponent } from './facturas/lista-facturas/filtrar-facturas.component';
import { ServiciosComponent } from './servicios/servicios.component';
import localeES from '@angular/common/locales/es';
import { PaginadorServiciosComponent } from './servicios/paginador-servicios/paginador-servicios.component';
import { DetalleServicioComponent } from './servicios/detalle-servicio/detalle-servicio.component';
import { ServicioBuscarComponent } from './servicios/detalle-servicio/servicio-buscar/servicio-buscar.component';
import { FormServicioComponent } from './servicios/form-servicio/form-servicio.component';


registerLocaleData(localeES, 'es');
const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},

  {path: 'clientes', component: ClientesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/details/:id', component: DetalleClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/page/:page', component: ClientesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/form', component: FormClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/form/:id', component: FormClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'productos', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/page/:page', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/form', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'productos/form/:id', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'servicios', component: ServiciosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'servicios/page/:page', component: ServiciosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'servicios/form', component: FormServicioComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'servicios/form/:id', component: FormServicioComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'users', component: UsersComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/page/:page', component: UsersComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/form', component: FormUserComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/form/:id', component: FormUserComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'regiones', component: RegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'regiones/page/:page', component: RegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'regiones/form', component: FormRegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'regiones/form/:id', component: FormRegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'categorias', component: CategoriasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'categorias/page/:page', component: CategoriasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'categorias/form', component: FormCategoriasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'categorias/form/:id', component: FormCategoriasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'facturas', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/page/:page', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'factura/filtrar', component: FiltrarFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'login', component: LoginComponent},


];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    UsersComponent,
    ProductosComponent,
    FormClienteComponent,
    FormUserComponent,
    FormProductoComponent,
    PaginadorClientesComponent,
    PaginadorProductosComponent,
    PaginadorUsersComponent,
    DetalleUserComponent,
    DetalleProductoComponent,
    DetalleClienteComponent,
    RegionesComponent,
    FormRegionesComponent,
    PaginadorRegionesComponent,
    DetalleRegionComponent,
    CategoriasComponent,
    FormCategoriasComponent,
    DetalleCategoriaComponent,
    DetalleCategoriaComponent,
    PaginadorCategoriasComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    ListaFacturasComponent,
    PaginadorFacturasComponent,
    ClienteFacturarComponent,
    ProductoBuscarComponent,
    FacturaBuscarComponent,
    FiltrarFacturasComponent,
    ServiciosComponent,
    PaginadorServiciosComponent,
    DetalleServicioComponent,
    ServicioBuscarComponent,
    FormServicioComponent,
  ],
  imports: [


  BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule

  ],
  providers: [ClienteService,
              UserService,
              ProductoService,
              RegionService,
              CategoriaService,
              ServicioService,
              {provide: LOCALE_ID, useValue: 'es' },
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
