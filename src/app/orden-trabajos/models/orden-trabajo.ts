import { OtDetalleMaquina } from "./ot-detalle-maquina";
import { Cliente } from '../../clientes/models/cliente';
import { Usuario } from "src/app/auth/models/usuario";

export class OrdenTrabajo {

    otr_Id: string = "";
    otr_NumeroOrden: string="";
    otr_Referencia: string="";
    otr_Tipo: string="";
    otr_FechaHoraCreacionOt: string="";
    otr_FechaHoraTerminoOt: string="";
    otr_Estado: string="";
    otr_Impuesto: string="";
    otr_PrecioTotal: string="";
    otr_EstadoPago: string="";
    otr_FormaPago: string="";
    otr_NombreContacto: string="";
    otr_TelefonoContacto: string="";
    otr_EmailContacto: string="";
    otr_RegionTrabajo: string="";
    otr_ComunaTrabajo: string="";
    otr_DireccionTrabajo: string="";
    otr_Observacion: string="";

    otr_Cli_Id: Cliente = new Cliente;
    otr_Usu_Id: Usuario = new Usuario;
   // otr_Odm_Id!: OtDetalleMaquina[];
    //otr_Odm_Id: OtDetalleMaquina[] | undefined;

    otr_Odm_Id: OtDetalleMaquina[] = new Array<OtDetalleMaquina>();
    
    // otr_Id: string="";
    // otr_Tipo: string="";
    // otr_FechaHoraSalida: string="";
    // otr_FechaHoraRetorno: string="";
    // otr_Estado: string="";
    // otr_Impuesto: string="";
    // otr_PrecioTotal: number=0;
    // otr_EstadoPago: string="";
    // otr_FormaPago: string="";
    // otr_Observacion: string="";
    // otr_NivelEstanqueSalida: string="";
    // otr_Traslado: string="";
    // otr_Combustible: string="";

    // /* RELACIONES DE CLASES */
    // otr_Odm_Id: OtDetalleMaquina[] = [];
    // otr_Cli_Id: Cliente = new Cliente;
    // //usuario: Usuario;


}
