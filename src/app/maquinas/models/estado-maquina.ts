import { Maquina } from './maquina';

export class EstadoMaquina {
    ema_Id: number=0;
    ema_Descripcion: string="";
    ema_Observacion: string="";
    ema_Estado: string="";
    /* RELACION DE CLASES */
    ema_Maquina: Maquina[]=[];
}
