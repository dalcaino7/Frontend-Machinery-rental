import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MaquinaService } from '../../services/maquina.service';
import { ActivatedRoute } from '@angular/router';
import { Maquina } from '../../models/maquina';
import { TipoMaquinaService } from '../../services/tipo-maquina.service';
import { TipoMaquina } from '../../models/tipo-maquina';
import { EstadoMaquina } from '../../models/estado-maquina';
import { EstadoMaquinaService } from '../../services/estado-maquina.service';
import { TipoCobroMaquinaService } from '../../services/tipo-cobro-maquina.service';
import { TipoCobroMaquina } from '../../models/tipo-cobro-maquina';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-maquina-dialog',
  templateUrl: './creacion-maquina-dialog.component.html',
  styleUrls: ['./creacion-maquina-dialog.component.css'],
})
export class CreacionMaquinaDialogComponent implements OnInit {
  titulo: string = '';
  nombreMaquina: string = '';
  nombreBoton: string = '';
  
  public maq: Maquina = new Maquina();
  public tMaq: TipoMaquina = new TipoMaquina();
  public eMaq: EstadoMaquina = new EstadoMaquina();
  public tcMaq: TipoCobroMaquina = new TipoCobroMaquina();

  tipoMaquinaSelect: any[] = [];
  estadoMaquinaSelect: any[] = [];
  tipoCobroMaquinaSelect: any[] = [];

    /* DECLARACION DE FORMULARIO DE OT */
    maquinaForm = this.formBuilder.group({
      /* VARIABLES BASICAS DE MAQUINARIA */
      txtNombreMaq: [''],
      txtDescripcionMaq: [''],
      selTipoMaq: [''],
      txtMarcaMaq: [''],
      txtModeloMaq: [''],
      txtAnioMaq: [''],
      selCombustibleMaq: [''],
      toogCilindroMaq: [''],

      /* VARIABLES DE INVENTARIO DE MAQUINARIA */

      txtCodigoMaq: [''],
      txtMotorMaq: [''],
      selEstadoMaq: [''],
      txtPatenteMaq: [''],
      txtLimMantencionMaq: [''],
      selMedidaMantencionMaq: [''],
      txtValorRenovacionMaq: [''],
      dateFechaRenovacionMaq: [''],
      selTipoRenovacionMaq: [''],

      /* VARIABLES DE INVENTARIO DE MAQUINARIA */
      dateFechaAdqMaq: [''],
      txtPrecioCompraMaq: [''],
      txtPrecioVentaMaq: [''],
      txtPrecioArriendoMaq: [''],
      selTipoCobroArriendoMaq: [''],
      txtValorMinimoMaq: [''],
      selTipoValorMinimoMaq: [''],
      txtUltimoRegistroMaq: [''],
      selTipoRegistroMaq: [''],
    });

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(MAT_DIALOG_DATA) public idMaq: DialogData,
    @Inject(MAT_DIALOG_DATA) public stateMainMaquina: DialogData,
    private maqService: MaquinaService,
    private TipoMaqService: TipoMaquinaService,
    private EstadoMaqService: EstadoMaquinaService,
    private tipoCobroMaqService: TipoCobroMaquinaService,
  ) {}

  ngOnInit(): void {

    this.validateShowDataDialog();

  }

  combustible: selectData[] = [
    { value: 'Bencina', viewValue: 'Bencina' },
    { value: 'Diesel', viewValue: 'Diesel' },
    { value: 'Eléctrico', viewValue: 'Eléctrico' },
    { value: 'Gas', viewValue: 'Gas' },
    { value: 'No Aplica', viewValue: 'No Aplica' },
    { value: 'Otro', viewValue: 'Otro' },
  ];

  medida: selectData[] = [
    { value: 'Horas', viewValue: 'Horas' },
    { value: 'KMs', viewValue: 'KMs' },
    { value: 'Meses', viewValue: 'Meses' },
    { value: 'Años', viewValue: 'Años' },
  ];
  renovacion: selectData[] = [
    { value: 'Horas', viewValue: 'Horas' },
    { value: 'KMs', viewValue: 'KMs' },
    { value: 'Años', viewValue: 'Años' },
    { value: 'Fecha', viewValue: 'Fecha' },
  ];

  tipoValorMinimo: selectData[] = [
    { value: 'Km', viewValue: 'Km' },
    { value: 'Hora', viewValue: 'Hora' },
    { value: 'Día', viewValue: 'Día' },
    { value: 'Mes', viewValue: 'Mes' },
    { value: 'Año', viewValue: 'Año' },
  ];

  tipoRegistro: selectData[] = [
    { value: 'Km', viewValue: 'Km' },
    { value: 'Hora', viewValue: 'Hora' }
  ];

  validateShowFechaRenovacion(tr: any) {
    switch (tr) {
      case 'Fecha':
        this.maquinaForm.patchValue({txtValorRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Fecha';
        break;
      case 'Horas':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Horas';
        break;
      case 'KMs':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'KMs';
        break;
      case 'Años':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Años';
        break;
    }
  }
 

  validaOperacion() {
    
    if (this.stateMainMaquina.modeDialog == 'add') {
      this.procesarInsert();
    }
    if (this.stateMainMaquina.modeDialog == 'mod') {
      this.procesarUpdate();
    }
  }

  procesarInsert() {
    this.maq.maq_Codigo               = this.maquinaForm.value['txtCodigoMaq'];
    this.maq.maq_Nombre               = this.maquinaForm.value['txtNombreMaq'];
    this.maq.maq_Descripcion          = this.maquinaForm.value['txtDescripcionMaq'];
    this.maq.maq_Patente              = this.maquinaForm.value['txtPatenteMaq'];
    this.maq.maq_Marca                = this.maquinaForm.value['txtMarcaMaq'];
    this.maq.maq_Modelo               = this.maquinaForm.value['txtModeloMaq'];
    this.maq.maq_NumMotorSerie        = this.maquinaForm.value['txtMotorMaq'];
    this.maq.maq_Anio                 = this.maquinaForm.value['txtAnioMaq'];
    this.maq.maq_Combustible          = this.maquinaForm.value['selCombustibleMaq'];
    this.maq.maq_UltKmHm              = this.maquinaForm.value['txtUltimoRegistroMaq'];
    this.maq.maq_TipoUltKmHm          = this.maquinaForm.value['selTipoRegistroMaq'];
    this.maq.maq_CilindroGas          = this.maquinaForm.value['toogCilindroMaq'];
    this.maq.maq_ValorArriendo        = this.maquinaForm.value['txtPrecioArriendoMaq'];
    this.maq.maq_ValorMinArriendo     = this.maquinaForm.value['txtValorMinimoMaq'];
    this.maq.maq_TipoValorMinArriendo = this.maquinaForm.value['selTipoValorMinimoMaq'];
    this.maq.maq_PrecioCompra         = this.maquinaForm.value['txtPrecioCompraMaq'];
    this.maq.maq_PrecioVenta          = this.maquinaForm.value['txtPrecioVentaMaq'];
    this.maq.maq_FechaAdquisicion     = this.maquinaForm.value['dateFechaAdqMaq'];
    this.maq.maq_ValorRenovacion      = this.maquinaForm.value['txtValorRenovacionMaq'];
    this.maq.maq_FechaRenovacion      = this.maquinaForm.value['dateFechaRenovacionMaq'];
    this.maq.maq_MedidaRenovacion     = this.maquinaForm.value['selTipoRenovacionMaq'];
    this.maq.maq_LimiteMantencion     = this.maquinaForm.value['txtLimMantencionMaq'];
    this.maq.maq_TiempoMantencion     = this.maquinaForm.value['selMedidaMantencionMaq'];

    this.maq.maq_Tma_Id.tma_Id        = this.maquinaForm.value['selTipoMaq'];
    this.maq.maq_Ema_Id.ema_Id        = this.maquinaForm.value['selEstadoMaq'];
    this.maq.maq_Tcm_Id.tcm_Id        = this.maquinaForm.value['selTipoCobroArriendoMaq'];
    this.maq.maq_Estado               = 'activo';

    this.maqService.createMaquina(this.maq).subscribe((resp) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `La maquinaria ha sido creado con éxito`,
        showConfirmButton: false,
        timer: 2300,
      });
      setInterval(function () {
        location.reload();
      }, 2000); //actualiza la pagina a los 2seg
      this.closeDialog();
    });
  }

  procesarUpdate() {
    this.maq.maq_Codigo               = this.maquinaForm.value['txtCodigoMaq'];
    this.maq.maq_Nombre               = this.maquinaForm.value['txtNombreMaq'];
    this.maq.maq_Descripcion          = this.maquinaForm.value['txtDescripcionMaq'];
    this.maq.maq_Patente              = this.maquinaForm.value['txtPatenteMaq'];
    this.maq.maq_Marca                = this.maquinaForm.value['txtMarcaMaq'];
    this.maq.maq_Modelo               = this.maquinaForm.value['txtModeloMaq'];
    this.maq.maq_NumMotorSerie        = this.maquinaForm.value['txtMotorMaq'];
    this.maq.maq_Anio                 = this.maquinaForm.value['txtAnioMaq'];
    this.maq.maq_Combustible          = this.maquinaForm.value['selCombustibleMaq'];
    this.maq.maq_UltKmHm              = this.maquinaForm.value['txtUltimoRegistroMaq'];
    this.maq.maq_TipoUltKmHm          = this.maquinaForm.value['selTipoRegistroMaq'];
    this.maq.maq_CilindroGas          = this.maquinaForm.value['toogCilindroMaq'];
    this.maq.maq_ValorArriendo        = this.maquinaForm.value['txtPrecioArriendoMaq'];
    this.maq.maq_ValorMinArriendo     = this.maquinaForm.value['txtValorMinimoMaq'];
    this.maq.maq_TipoValorMinArriendo = this.maquinaForm.value['selTipoValorMinimoMaq'];
    this.maq.maq_PrecioCompra         = this.maquinaForm.value['txtPrecioCompraMaq'];
    this.maq.maq_PrecioVenta          = this.maquinaForm.value['txtPrecioVentaMaq'];
    this.maq.maq_FechaAdquisicion     = this.maquinaForm.value['dateFechaAdqMaq'];
    this.maq.maq_ValorRenovacion      = this.maquinaForm.value['txtValorRenovacionMaq'];
    this.maq.maq_FechaRenovacion      = this.maquinaForm.value['dateFechaRenovacionMaq'];
    this.maq.maq_MedidaRenovacion     = this.maquinaForm.value['selTipoRenovacionMaq'];
    this.maq.maq_LimiteMantencion     = this.maquinaForm.value['txtLimMantencionMaq'];
    this.maq.maq_TiempoMantencion     = this.maquinaForm.value['selMedidaMantencionMaq'];

    this.maq.maq_Tma_Id.tma_Id        = this.maquinaForm.value['selTipoMaq'];
    this.maq.maq_Ema_Id.ema_Id        = this.maquinaForm.value['selEstadoMaq'];
    this.maq.maq_Tcm_Id.tcm_Id        = this.maquinaForm.value['selTipoCobroArriendoMaq'];
    this.maq.maq_Estado               = 'activo';

    this.maqService.updateMaquina(this.maq).subscribe(() => {

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Registros actualizados exitosamente`,
        showConfirmButton: false,
        timer: 2300,
      });
       setInterval(function () {
        location.reload();
      }, 2000); //actualiza la pagina a los 2seg  
      this.closeDialog();
    });
  }

  setValueToggle(e: any){
    if(e.checked){
      this.maq.maq_CilindroGas = 'SI';
      this.maquinaForm.patchValue({ toogCilindroMaq: 'SI' });
     }else{
      this.maq.maq_CilindroGas = 'NO';
      this.maquinaForm.patchValue({ toogCilindroMaq: 'NO' });
     }
  }

  closeDialog() { 
    this.dialog.closeAll();
  }

  validateShowDataDialog() {
    if (this.data.modeDialog == 'add') {
      this.titulo = 'Nueva Maquinaria';
      this.nombreMaquina = '';
      this.nombreBoton = 'Guardar';
    }
    if (this.data.modeDialog == 'mod') {
      this.titulo = 'Modificación de Maquinaria';
      this.nombreMaquina = '';
      this.nombreBoton = 'Actualizar';
      this.showMaquina();
    }
  }

  showMaquina() {
    /* DATOS MAQUINA */
    this.maqService.getMaquina(this.idMaq.idMaquinaDialog).subscribe((m) => {
      this.maq = m;
    /*INSERTA VALORES DEL OBJETO MODELO A LA VISTA DEL FORM */      
      this.maquinaForm.patchValue({
        selTipoMaq: this.maq.maq_Tma_Id.tma_Id,
        txtNombreMaq: this.maq.maq_Nombre,
        txtDescripcionMaq: this.maq.maq_Descripcion,
        txtMarcaMaq: this.maq.maq_Marca,
        txtModeloMaq: this.maq.maq_Modelo,
        txtAnioMaq: this.maq.maq_Anio,
        selCombustibleMaq: this.maq.maq_Combustible,
       // toogCilindroMaq: this.maq.maq_CilindroGas,
        txtCodigoMaq: this.maq.maq_Codigo,
        txtMotorMaq: this.maq.maq_NumMotorSerie,
        txtPatenteMaq: this.maq.maq_Patente,
        txtLimMantencionMaq: this.maq.maq_LimiteMantencion,
        selMedidaMantencionMaq: this.maq.maq_TiempoMantencion,
        txtValorRenovacionMaq: this.maq.maq_ValorRenovacion,
        dateFechaRenovacionMaq: this.maq.maq_FechaRenovacion,
        selTipoRenovacionMaq: this.maq.maq_MedidaRenovacion,
        dateFechaAdqMaq: this.maq.maq_FechaAdquisicion,
        txtPrecioCompraMaq:this.maq.maq_PrecioCompra,
        txtPrecioVentaMaq: this.maq.maq_PrecioVenta,
        txtPrecioArriendoMaq: this.maq.maq_ValorArriendo,
        txtValorMinimoMaq: this.maq.maq_ValorMinArriendo,
        selTipoValorMinimoMaq: this.maq.maq_TipoValorMinArriendo,
        txtUltimoRegistroMaq: this.maq.maq_UltKmHm,
        selTipoRegistroMaq: this.maq.maq_TipoUltKmHm
      }); 

      this.listTipoMaquinas();
      this.listEstadoMaquina();
      this.listTipoCobroMaquina();
    });
  }

  
  listTipoMaquinas() {
    /* TRAE Y LISTA LAS OPCIONES EN EL SELECT DESDE LA BD*/
    this.TipoMaqService.getListTipoMaquinas().subscribe(
      (tm: TipoMaquina[]) => {
      this.tipoMaquinaSelect = tm;
    });
    /* INSERTA PARA MOSTRAR EN EL SELECT EL CAMPO POR DEFECTO DESDE EL API */
    this.maquinaForm.patchValue({
      selTipoMaq: this.maq.maq_Tma_Id.tma_Id
    }); 
  }

  listEstadoMaquina() {
    /* TRAE Y LISTA LAS OPCIONES EN EL SELECT DESDE LA BD*/
    this.EstadoMaqService.getListEstadoMaquinas().subscribe(
      (em: EstadoMaquina[]) => {
        (this.estadoMaquinaSelect = em)
    });
      /* INSERTA PARA MOSTRAR EN EL SELECT EL CAMPO POR DEFECTO DESDE EL API */
    this.maquinaForm.patchValue({
      selEstadoMaq: this.maq.maq_Ema_Id.ema_Id
    }); 
  }

  listTipoCobroMaquina() {
    this.tipoCobroMaqService.getListTipoCobroMaquina().subscribe(
      (tcm: TipoCobroMaquina[]) => {
        (this.tipoCobroMaquinaSelect = tcm)
    });
    /* INSERTA PARA MOSTRAR EN EL SELECT EL CAMPO POR DEFECTO DESDE EL API */
    this.maquinaForm.patchValue({
      selTipoCobroArriendoMaq: this.maq.maq_Tcm_Id.tcm_Id
    }); 
  }
}
interface selectData {
  value: string;
  viewValue: string;
}

export interface DialogData {
  modeDialog: string;
  idMaquinaDialog: number;
}
