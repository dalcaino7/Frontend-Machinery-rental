
import { Maquina } from '../../maquinas/models/maquina';


export class OtDetalleMaquina {

    id: number=0;
    fechaHrInicio: string="";  
    controlInicio: number=0;  
    fechaHrTermino: string="";  
    controlTermino: number=0;  
    firmaUsuario: string="";  

    /* RELACION ENTRE CLASES */
    maquina: Maquina = new Maquina;
    

}
