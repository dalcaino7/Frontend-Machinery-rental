import { Component, OnInit, Inject, PipeTransform, Input } from '@angular/core';
import {
  FormBuilder,
  Validators,
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
//import { ReplaceDecimalFormatPipe } from '../../../pipes/replace-decimal-format.pipe';
import { AnyObject } from 'chart.js/types/basic';


@Component({
  selector: 'app-creacion-maquina-dialog',
  templateUrl: './creacion-maquina-dialog.component.html',
  styleUrls: ['./creacion-maquina-dialog.component.css'],
})
export class CreacionMaquinaDialogComponent implements OnInit {


  titulo: string = '';
  nombreMaquina: string = '';
  nombreBoton: string = '';
  validacionSelect: boolean = true;
  private ValorRenovacionValidators = [
    Validators.required
   // Validators.maxLength(250),
    //Validators.minLength(5),
   // Validators.pattern(/.+@.+\..+/)
];
  public maq: Maquina = new Maquina();
  public tMaq: TipoMaquina = new TipoMaquina();
  public eMaq: EstadoMaquina = new EstadoMaquina();
  public tcMaq: TipoCobroMaquina = new TipoCobroMaquina();

  tipoMaquinaSelect: any[] = [];
  estadoMaquinaSelect: any[] = [];
  tipoCobroMaquinaSelect: any[] = [];

  maquinaForm : any;


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
    //private replaceDecimalFormat: ReplaceDecimalFormatPipe
  ) {}

  ngOnInit(): void {

      if (this.data.modeDialog == 'add') {
        this.validacionSelect = true;
      }else{
        if (this.data.modeDialog == 'mod') {
          this.validacionSelect = false;
        }
      }
    
  


    /* DECLARACION DE FORMULARIO DE OT */
    this.maquinaForm = this.formBuilder.group({
    
      /* 
      (/^([0-9]+\,?[0-9]{0,3})$/) Pattern Decimales
      (/^-?(0|[1-9]\d*)?$/)   Pattern Numeros enteros
      */
      /* VARIABLES BASICAS DE MAQUINARIA */
      txtNombreMaq: ['',[Validators.required, Validators.minLength(2)]],
      txtDescripcionMaq: ['',[Validators.required, Validators.maxLength(30)]],
      selTipoMaq: ['', Validators.min(1)],
      txtMarcaMaq: ['',[Validators.required, Validators.maxLength(30)]],
      txtModeloMaq: ['',[Validators.required, Validators.maxLength(30)]],
      txtAnioMaq: ['',[Validators.required, Validators.min(1900),Validators.max(2999), Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ],//pattern SOLO NUMEROS
      selCombustibleMaq: [''],
      toogCilindroMaq: [''],
    
      /* VARIABLES DE INVENTARIO DE MAQUINARIA */
      txtCodigoMaq: ['',[Validators.required, Validators.maxLength(20)]],
      txtMotorMaq: ['', Validators.maxLength(50)],
      selEstadoMaq: ['',Validators.min(1)],
      txtPatenteMaq: ['', Validators.maxLength(30)],
      txtLimMantencionMaq: ['', [ Validators.maxLength(10), Validators.pattern(/^([0-9]+\,?[0-9]{0,3})$/)]],
      selMedidaMantencionMaq: [{value: '', disabled: this.validacionSelect},[Validators.required]],
      //selMedidaMantencionMaq: ['',Validators.min(1)],
      txtValorRenovacionMaq: ['',[ Validators.maxLength(10), Validators.pattern(/^([0-9]+\,?[0-9]{0,3})$/)]],
      dateFechaRenovacionMaq: [''],
      selTipoRenovacionMaq: [{value: '', disabled: false}], //validacion: selector requerido al ingresar datos en txt
    
      /* VARIABLES DE INVENTARIO DE MAQUINARIA /^[+-]?([0-9]*[.])?[0-9]+$/ */
      dateFechaAdqMaq: [''],
      txtPrecioCompraMaq: ['',[ Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      txtPrecioVentaMaq: ['',[ Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      txtPrecioArriendoMaq: ['',[ Validators.min(1), Validators.required, Validators.maxLength(10), Validators.pattern(/^([0-9]+\,?[0-9]{0,3})$/)]],
      selTipoCobroArriendoMaq: [{value: '', disabled: this.validacionSelect},[Validators.min(1)]],
      txtValorMinimoMaq: ['',[ Validators.maxLength(10),    Validators.pattern(/^([0-9]+\,?[0-9]{0,3})$/)]],
      selTipoValorMinimoMaq: [{value: '', disabled: this.validacionSelect},[Validators.required]],
      txtUltimoRegistroMaq: ['',[ Validators.maxLength(10), Validators.pattern(/^([0-9]+\,?[0-9]{0,3})$/)]],
      selTipoRegistroMaq: [{value: '', disabled: this.validacionSelect},[Validators.required]],
    });


    this.validateShowDataDialog();

  }


  validateShowFechaRenovacion(tr: any) {

    switch (tr) {
      case 'Fecha':
        this.maquinaForm.patchValue({txtValorRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Fecha';
        break;
      case 'Hora':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Hora';
        break;
      case 'Km':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Km';
        break;
      case 'Año':
        this.maquinaForm.patchValue({dateFechaRenovacionMaq:''});
        this.maq.maq_MedidaRenovacion = 'Año';
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

/*     let validacionExitosa = false;
 */
    if(this.maquinaForm.valid){    
  
      this.maq.maq_Codigo               = this.maquinaForm.value['txtCodigoMaq'];
      this.maq.maq_Nombre               = this.maquinaForm.value['txtNombreMaq'];
      this.maq.maq_Descripcion          = this.maquinaForm.value['txtDescripcionMaq'];
      this.maq.maq_Patente              = this.maquinaForm.value['txtPatenteMaq'];
      this.maq.maq_Marca                = this.maquinaForm.value['txtMarcaMaq'];
      this.maq.maq_Modelo               = this.maquinaForm.value['txtModeloMaq'];
      this.maq.maq_NumMotorSerie        = this.maquinaForm.value['txtMotorMaq'];
      this.maq.maq_Anio                 = this.maquinaForm.value['txtAnioMaq'];
      this.maq.maq_Combustible          = this.maquinaForm.value['selCombustibleMaq'];
      this.maq.maq_UltKmHm              = this.maquinaForm.value['txtUltimoRegistroMaq'].replace(",", ".");
      this.maq.maq_TipoUltKmHm          = this.maquinaForm.value['selTipoRegistroMaq'];
  
      if(this.maq.maq_CilindroGas === ''){
        this.maq.maq_CilindroGas        = 'NO';
      }else{
        this.maq.maq_CilindroGas        = this.maquinaForm.value['toogCilindroMaq'];
      }
  
      this.maq.maq_ValorArriendo        = this.maquinaForm.value['txtPrecioArriendoMaq'].replace(",", ".");
      this.maq.maq_ValorMinArriendo     = this.maquinaForm.value['txtValorMinimoMaq'].replace(",", ".");
      this.maq.maq_TipoValorMinArriendo = this.maquinaForm.value['selTipoValorMinimoMaq'];
      this.maq.maq_PrecioCompra         = this.maquinaForm.value['txtPrecioCompraMaq'];
      this.maq.maq_PrecioVenta          = this.maquinaForm.value['txtPrecioVentaMaq'];
      this.maq.maq_FechaAdquisicion     = this.maquinaForm.value['dateFechaAdqMaq'];

      this.maq.maq_ValorRenovacion      = this.maquinaForm.value['txtValorRenovacionMaq'].replace(",", ".");
      this.maq.maq_FechaRenovacion      = this.maquinaForm.value['dateFechaRenovacionMaq'];
      this.maq.maq_MedidaRenovacion     = this.maquinaForm.value['selTipoRenovacionMaq'];


      this.maq.maq_LimiteMantencion     = this.maquinaForm.value['txtLimMantencionMaq'].replace(",", ".");
      this.maq.maq_TiempoMantencion     = this.maquinaForm.value['selMedidaMantencionMaq'];
  
      this.maq.maq_Tma_Id.tma_Id        = this.maquinaForm.value['selTipoMaq'];
      this.maq.maq_Ema_Id.ema_Id        = this.maquinaForm.value['selEstadoMaq'];
      this.maq.maq_Tcm_Id.tcm_Id        = this.maquinaForm.value['selTipoCobroArriendoMaq'];
      this.maq.maq_Estado               = 'activo';
  
       this.maqService.createMaquina(this.maq).subscribe(() => {
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

  
    }else{
      console.log("form invalido");
      Swal.fire('Error en el ingreso de datos', 'Debe ingresar correctamente todos los Campos requeridos');

    }

    
  }




  procesarUpdate() {
    if(this.maquinaForm.valid){
      this.maq.maq_Codigo               = this.maquinaForm.value['txtCodigoMaq'];
      this.maq.maq_Nombre               = this.maquinaForm.value['txtNombreMaq'];
      this.maq.maq_Descripcion          = this.maquinaForm.value['txtDescripcionMaq'];
      this.maq.maq_Patente              = this.maquinaForm.value['txtPatenteMaq'];
      this.maq.maq_Marca                = this.maquinaForm.value['txtMarcaMaq'];
      this.maq.maq_Modelo               = this.maquinaForm.value['txtModeloMaq'];
      this.maq.maq_NumMotorSerie        = this.maquinaForm.value['txtMotorMaq'];
      this.maq.maq_Anio                 = this.maquinaForm.value['txtAnioMaq'];
      this.maq.maq_Combustible          = this.maquinaForm.value['selCombustibleMaq'];
      this.maq.maq_UltKmHm              = this.maquinaForm.value['txtUltimoRegistroMaq'].toString().replace(",", ".");
  
      this.maq.maq_TipoUltKmHm          = this.maquinaForm.value['selTipoRegistroMaq'];
      this.maq.maq_CilindroGas          = this.maquinaForm.value['toogCilindroMaq'];
      this.maq.maq_ValorArriendo        = this.maquinaForm.value['txtPrecioArriendoMaq'].toString().replace(",", ".");
      this.maq.maq_ValorMinArriendo     = this.maquinaForm.value['txtValorMinimoMaq'].toString().replace(",", ".");
      this.maq.maq_TipoValorMinArriendo = this.maquinaForm.value['selTipoValorMinimoMaq'];
      this.maq.maq_PrecioCompra         = this.maquinaForm.value['txtPrecioCompraMaq'];
      this.maq.maq_PrecioVenta          = this.maquinaForm.value['txtPrecioVentaMaq'];
      this.maq.maq_FechaAdquisicion     = this.maquinaForm.value['dateFechaAdqMaq'];
      this.maq.maq_ValorRenovacion      = this.maquinaForm.value['txtValorRenovacionMaq'].toString().replace(",", ".");
      this.maq.maq_FechaRenovacion      = this.maquinaForm.value['dateFechaRenovacionMaq'];
      this.maq.maq_MedidaRenovacion     = this.maquinaForm.value['selTipoRenovacionMaq'];
      this.maq.maq_LimiteMantencion     = this.maquinaForm.value['txtLimMantencionMaq'].toString().replace(",", ".");
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

  }else{
    console.log("form invalido");
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: `Debe ingresar correctamente todos los Campos requeridos`,
      showConfirmButton: true
      //timer: 2300,
    });
  }
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
      this.validacionSelect = false;

      this.titulo = 'Nueva Maquinaria';
      this.nombreMaquina = '';
      this.nombreBoton = 'Guardar';
      this.listTipoMaquinas();
      this.listEstadoMaquina();
      this.listTipoCobroMaquina();
    }
    if (this.data.modeDialog == 'mod') {
      this.validacionSelect = true;

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

      /* FUNCIONES DE DESHABILITAR SELECTOR CUANDO CAMPO ASOCIADO ESTA NULO */
      if(this.maq.maq_LimiteMantencion === null ){
        this.maq.maq_LimiteMantencion = '';
        this.maquinaForm.controls['selMedidaMantencionMaq'].disable();
      }
      if(this.maq.maq_ValorRenovacion === null ){
        this.maq.maq_ValorRenovacion = '';
      }

      if(this.maq.maq_ValorArriendo === null ){
        this.maq.maq_ValorArriendo = '';
        this.maquinaForm.controls['selTipoCobroArriendoMaq'].disable();
      }
      if(this.maq.maq_ValorMinArriendo === null ){
        this.maq.maq_ValorMinArriendo = '';
        this.maquinaForm.controls['selTipoValorMinimoMaq'].disable();
      }
      if(this.maq.maq_UltKmHm === null ){
        this.maq.maq_UltKmHm = '';
        this.maquinaForm.controls['selTipoRegistroMaq'].disable();
      }
     
    
      
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
        txtLimMantencionMaq: this.maq.maq_LimiteMantencion.toString().replace(/\./g,','),
        selMedidaMantencionMaq: this.maq.maq_TiempoMantencion,
        txtValorRenovacionMaq: this.maq.maq_ValorRenovacion.toString().replace(/\./g,','),
        dateFechaRenovacionMaq: this.maq.maq_FechaRenovacion,
        selTipoRenovacionMaq: this.maq.maq_MedidaRenovacion,
        dateFechaAdqMaq: this.maq.maq_FechaAdquisicion,
        txtPrecioCompraMaq:this.maq.maq_PrecioCompra,
        txtPrecioVentaMaq: this.maq.maq_PrecioVenta,
        txtPrecioArriendoMaq: this.maq.maq_ValorArriendo.toString().replace(/\./g,','),
        txtValorMinimoMaq: this.maq.maq_ValorMinArriendo.toString().replace(/\./g,','),
        selTipoValorMinimoMaq: this.maq.maq_TipoValorMinArriendo,
        txtUltimoRegistroMaq: this.maq.maq_UltKmHm.toString().replace(/\./g,','),
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

  validatorsForm(campo: string){
    return this.maquinaForm.controls[campo].errors && // AL HABER ERRORES DESCRITOS EN LA DEFINICION DEL CONTROLFORM
    (this.maquinaForm.controls[campo].touched ); // AL SER TOCADO EL CAMPO
  }

  validatorsSelectForm(campo: string){
    return this.maquinaForm.controls[campo].errors && // AL HABER ERRORES DESCRITOS EN LA DEFINICION DEL CONTROLFORM
    (this.maquinaForm.controls[campo].touched || this.maquinaForm.controls[campo].invalid  ); // AL SER TOCADO EL CAMPO
  }

  EnabledSelector(evt: any, nameInput: string, nameSelect: string){ // metodo que detecta la tecla retroceso para deshabilitar el selector
    var key = window.Event ? evt.which : evt.keyCode;   
      if(key === 8 && this.maquinaForm.value[nameInput].length  === 1){ //8: tecla retroceso , largo es 1 => no hay datos
          this.maquinaForm.controls[nameSelect].disable();
      }
  }

// evento keypress, input del form
  filterFloat(evt: any, input: any, nameSelect: string){ // Comprueba que el valor ingresado sea solo numero decimal con coma y 3 decimales
    // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43, ‘,’ = 44
    var key = window.Event ? evt.which : evt.keyCode;   
    var chark = String.fromCharCode(key);
    var tempValue = input.value+chark;
    var isNumber = (key >= 48 && key <= 57);
    var isSpecial = (key == 8 || key == 13 || key == 0 || key == 44);
    var preg = /^([0-9]+\,?[0-9]{0,3})$/;
    if(isNumber || isSpecial){
      if((preg.test(tempValue) === true)){
        this.maquinaForm.controls[nameSelect].enable();
        return (preg.test(tempValue) === true)
      }
    }
   return false;
  }

  formattedNumbersView(value : string){
      return value.toString().replace(/\./g,',');
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
    { value: 'Hora', viewValue: 'Hora' },
    { value: 'Km', viewValue: 'Km' },
    { value: 'Mes', viewValue: 'Mes' },
    { value: 'Año', viewValue: 'Año' },
  ];
  renovacion: selectData[] = [
    { value: 'Hora', viewValue: 'Hora' },
    { value: 'Km', viewValue: 'Km' },
    { value: 'Año', viewValue: 'Año' },
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

}

interface selectData {
  value: string;
  viewValue: string;
}

export interface DialogData {
  modeDialog: string;
  idMaquinaDialog: string;
}
