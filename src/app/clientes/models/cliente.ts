import { Region } from "src/app/models/region";
import { Comuna } from '../../models/comuna';

export class Cliente {

    cli_Id:string="";
    cli_Rut:string="";
    cli_RazonSocial:string="";
    cli_Nombre:string="";
    cli_Apellidos:string="";
    cli_Telefono:string="";
    cli_Email:string="";
    cli_Direccion:string="";
    cli_Comuna: Comuna= new Comuna();
    cli_Region: Region = new Region();
    cli_Pais:string="";
    cli_Observacion:string="";
    cli_Foto:string="";
    cli_Estado:string="";

    cli_Estado_Arriendo: string="";
    cli_Estado_Maquinaria: string="";
    cli_Estado_Pago: string="";

}