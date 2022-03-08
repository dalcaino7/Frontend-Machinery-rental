import { EstadoMaquina } from './estado-maquina';
import { TipoCobroMaquina } from './tipo-cobro-maquina';
import { TipoMaquina } from './tipo-maquina';

export class Maquina {
 
  maq_Id: number = 0;
  maq_Codigo: string = '';
  maq_Nombre: string = '';
  maq_Descripcion: string = '';
  maq_Patente: string = '';
  maq_Marca: string = '';
  maq_Modelo: string = '';
  maq_NumMotorSerie: string = '';
  maq_Anio: string = '';
  maq_Combustible: string = '';
  maq_UltKmHm: number = 0;
  maq_TipoUltKmHm: string = '';
  maq_CilindroGas: string = '';
  maq_ValorArriendo: number = 0;
  maq_ValorMinArriendo: number = 0;
  maq_TipoValorMinArriendo: string = '';
  maq_PrecioCompra: number = 0;
  maq_PrecioVenta: number = 0;
  maq_FechaAdquisicion: string = '';

  maq_ValorRenovacion: string = ''; //10000, 350000, 
  maq_FechaRenovacion: string = ''; //02/05/2026
  maq_MedidaRenovacion: string = ''; //Hrs, KMS, en fecha es vacio.

  maq_LimiteMantencion: number = 0;
  maq_TiempoMantencion: string = '';

  maq_Foto: string="";
  maq_Estado: string = '';

 /*  maq_Tma_Id: TipoMaquina;
  maq_Ema_Id: number = 0;
  maq_Tcm_Id: number = 0; 
  */
  maq_Tma_Id: TipoMaquina = new TipoMaquina();
  maq_Ema_Id: EstadoMaquina = new EstadoMaquina();
  maq_Tcm_Id: TipoCobroMaquina = new TipoCobroMaquina();

  /* RELACIONES DE CLASES */
}
