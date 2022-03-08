import { OtDetalleMaquina } from "./ot-detalle-maquina";
import { Cliente } from '../../clientes/models/cliente';

export class OrdenTrabajo {
    
    id: number=0;
    tipo: string="";
    fechaHrSalida: string="";
    fechaHrRetorno: string="";
    estado: string="";
    impuesto: string="";
    precioTotal: number=0;
    estadoPago: string="";
    formaPago: string="";
    observacion: string="";
    nivEstanSalida: string="";
    traslado: string="";
    combustible: string="";

    /* RELACIONES DE CLASES */
    otDetMaq: OtDetalleMaquina[] = [];
    cli: Cliente = new Cliente;
    //usuario: Usuario;


}
