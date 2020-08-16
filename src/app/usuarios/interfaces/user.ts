import { Factura } from '../../facturas/interfaces/factura';
export class User {
  id: number;
  // tslint:disable-next-line: variable-name
  _id: string;
  fecha: string;
  documento: string;
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  createAt: string;
  direccion: string;
  telefono: string;
  celular1: string;
  celular2: string;
  estado: string;
  email: string;
  foto: string;
  roles: string [] = [];
  facturas: Array<Factura> = [];

}
