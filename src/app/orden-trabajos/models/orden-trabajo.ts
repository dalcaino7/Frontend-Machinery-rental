import { OtDetalleMaquina } from "./ot-detalle-maquina";
import { Cliente } from '../../clientes/models/cliente';

export class OrdenTrabajo {
    
    otr_Id: string="";
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
    otr_Combustible: string="";

    /* RELACIONES DE CLASES */
    otr_Odm_Id: OtDetalleMaquina[] = [];
    otr_Cli_Id: Cliente = new Cliente;
    //usuario: Usuario;


}
