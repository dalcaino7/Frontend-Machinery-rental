import { Maquina } from './maquina';

export class TipoCobroMaquina {
    tcm_Id: number=0;
    tcm_Descripcion: string="";
    tcm_Observacion: string="";
    tcm_Estado: string="";
    /* RELACION DE CLASES */
    tcm_Maquina: Maquina[]=[];
}
