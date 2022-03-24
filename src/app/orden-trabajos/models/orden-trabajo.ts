import { OtDetalleMaquina } from "./ot-detalle-maquina";
import { Cliente } from '../../clientes/models/cliente';

export class OrdenTrabajo {
    
    otr_Id: number=0;
    otr_Tipo: string="";
    otr_FechaHoraSalida: string="";
    otr_FechaHoraRetorno: string="";
    otr_Estado: string="";
    otr_Impuesto: string="";
    otr_PrecioTotal: number=0;
    otr_EstadoPago: string="";
    otr_FormaPago: string="";
    otr_Observacion: string="";
    otr_NivelEstanqueSalida: string="";
    otr_Traslado: string="";
    otr_combustible: string="";

    /* RELACIONES DE CLASES */
    otr_otDetMaq: OtDetalleMaquina[] = [];
    cli_Id: Cliente = new Cliente;
    //usuario: Usuario;


}
