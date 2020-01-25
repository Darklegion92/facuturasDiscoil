import { Region } from '../regiones/region';
import { Factura } from './../facturas/models/factura';
import { User } from './../users/user';
export class Cliente {
  id: number;
  fecha: string;
  documento: string;
  nombre: string;
  apellido: string;
  createAt: string;
  direccion: string;
  telefono: string;
  celular1: string;
  celular2: string;
  email: string;
  foto: string;
  region: Region;
  user: User;
  facturas: Array<Factura> = [];


}
