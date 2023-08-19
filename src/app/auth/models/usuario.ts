import { OrdenTrabajo } from '../../orden-trabajos/models/orden-trabajo';

export class Usuario {

    usu_Id: string="";
    usu_Usuario:string="";
    usu_Nombre:string="";
    usu_Apellido:string="";
    usu_Email:string="";
    usu_Genero:string="";
    usu_Password:string="";
    usu_Foto:string="";
    usu_FechaCreacion:string="";
    usu_UltimoAcceso:string="";
    usu_Estado:string="";

    /* RELACION DE CLASES */
    usu_Ot: OrdenTrabajo[]=[];

}
