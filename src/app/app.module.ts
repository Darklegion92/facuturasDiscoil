import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import { UsuariosComponent } from './usuarios/lista-usuarios/usuarios.component';

import { ClienteService } from './usuarios/services/cliente.service';
import { UserService } from './usuarios/services/user.service';
import { ProductoService } from './productos/services/producto.service';

import { ProductosComponent } from './productos/lista-productos/productos.component';
import { FormUsuariosComponent } from './usuarios/formularios/form-usuarios.component';
import { FormProductoComponent } from './productos/formularios/form-producto.component';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
import { PerfilUsuariosComponent } from './usuarios/perfil-usuarios/perfil-usuarios.component';
import { LoginComponent } from './usuarios/login/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura/detalle-factura.component';
import { FacturasComponent } from './facturas/facturacion/facturas.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';

import { ListaFacturasComponent } from './facturas/lista-facturas/lista-facturas.component';
import { ClienteFacturarComponent } from './facturas/cliente-facturar/cliente-facturar.component';
import { ProductoBuscarComponent } from './productos/producto-buscar/producto-buscar.component';
import { FacturaBuscarComponent } from './facturas/buscar-factura-numero/factura-buscar.component';
import { FiltrarFacturasComponent } from './facturas/buscar-por-rango-fecha/filtrar-facturas.component';
import localeES from '@angular/common/locales/es';

import { PaginadorComponent } from './generales/paginador/paginador.component';
import { LoadingComponent } from './generales/loading/loading.component';
import { Pagina404Component } from './generales/pagina404/pagina404.component';
import { DetalleUsuariosComponent } from './usuarios/detalle-usuarios/detalle-usuarios.component';
import { ModalPublicidadComponent } from './generales/publicidad/modal-publicidad/modal-publicidad.component';
import { FilterPipe } from './generales/pipes/filter.pipe';

registerLocaleData(localeES, 'es');
const routes: Routes = [

  {path: '', redirectTo: 'usuarios/perfil', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},

  {path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'usuarios/perfil', component: PerfilUsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'usuarios/detalle/:id', component: DetalleUsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'clientes/page/:page', component: UsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'usuarios/form', component: FormUsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'usuarios/form/:id', component: FormUsuariosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'productos', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/page/:page', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/form', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'productos/form/:id', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'facturas', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'facturas/page/:page', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/form', component: FacturasComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent},
  {path: 'factura/filtrar', component: FiltrarFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: '**', component: Pagina404Component},


];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UsuariosComponent,
    ProductosComponent,
    FormUsuariosComponent,
    FormProductoComponent,
    DetalleProductoComponent,
    PerfilUsuariosComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    ListaFacturasComponent,
    ClienteFacturarComponent,
    ProductoBuscarComponent,
    FacturaBuscarComponent,
    FiltrarFacturasComponent,
    PaginadorComponent,
    LoadingComponent,
    Pagina404Component,
    DetalleUsuariosComponent,
    ModalPublicidadComponent,
    FilterPipe,
  ],
  imports: [


  BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatRadioModule

  ],
  providers: [ClienteService,
              UserService,
              ProductoService,
              {provide: LOCALE_ID, useValue: 'es' },
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
