
import { Maquina } from '../../maquinas/models/maquina';


export class OtDetalleMaquina {

    odm_Id: number=0;
    odm_FechaHrInicio: string="";  
    odm_ControlInicio: number=0;  
    odm_FechaHrTermino: string="";  
    odm_ControlTermino: number=0;  
    odm_NombreUsuario: string="";  
    odm_Operario: String="";
    /* RELACION ENTRE CLASES */
    odm_Maq_Id: Maquina = new Maquina;
    

}
