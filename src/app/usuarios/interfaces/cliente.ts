import { Factura } from '../../facturas/interfaces/factura';
import { User } from './user';
export class Cliente {
  id: number;
  fecha: string;
  documento: string;
  nombre?: string;
  apellido?: string;
  createAt?: string;
  direccion?: string;
  telefono?: string;
  celular1?: string;
  celular2?: string;
  email?: string;
  foto?: string;
  user?: User;
  facturas?: Array<Factura> = [];


}
