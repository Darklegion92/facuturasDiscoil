import { ItemFactura } from './item-factura';
import { Cliente } from '../../usuarios/interfaces/cliente';
import { User } from '../../usuarios/interfaces/user';
export class Factura {
  id?: number;
  // tslint:disable-next-line: variable-name
  _id?: string;
  descripcion = 'Factura Venta';
  observacion?: string;
  nombre?: string;
  createAt?: string;
  items: Array<ItemFactura> = [];
  cliente: Cliente;
  usuario: User;
  descuento = 0;
  estado?: string;
  total?: number;
  totalGanancia?: number;


  aplicarDescuento(desc: number) {
    this.total -= desc;
  }

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total +=  item.calcularImporte();
    });
    if (this.descuento > 0) {
      this.total -= this.descuento;
    }
    return this.total;
  }
  calcularGananciaTotal(): number {
    this.totalGanancia = 0;
    this.items.forEach((item: ItemFactura) => {
      this.totalGanancia +=  item.calcularGanancia();
    });
    if (this.descuento > 0) {
      this.totalGanancia -= this.descuento;
    }
    return this.totalGanancia;
  }

}
