import { OrdenTrabajo } from '../../orden-trabajos/models/orden-trabajo';

export class Usuario {

    id: number=0;
    usuario:string="";
    nombre:string="";
    apellido:string="";
    email:string="";
    genero:string="";
    password:string="";
    foto:string="";
    fechaCreacion:string="";
    ultimoAcceso:string="";
    estado:string="";

    /* RELACION DE CLASES */
    ot: OrdenTrabajo[]=[];

}
