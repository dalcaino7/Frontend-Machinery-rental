import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-resumen-arriendo-dialog',
  templateUrl: './resumen-arriendo-dialog.component.html',
  styleUrls: ['./resumen-arriendo-dialog.component.css']
})
export class ResumenArriendoDialogComponent implements OnInit {
  
  ordenIdOt: any = this.data.idOt;
  cliRazonSocialOt: string = "";
  cliNameOt: string = "";
  cliApellidosOt: string = "";
  cliRutOt: string = "";
  cliContactoOt: string = "";
  cliEmailOt: string = "";
  cliTelefonoOt: string = "";
  cliDireccionOt: string = "";
  cliComunaOt: string = "";
  cliRegionOt: string = "";

  

  

  listMaq: Array<Maq> = [];

  resumenArriendoForm!: FormGroup;
  displayedColumns: string[] = [
    'fecha',
    'inicio',
    'termino',
    'total'
  ];

  

  estados: EstadoArriendos[] = [
    { value: 'en-terreno-1', viewValue: 'Efectivo' },
    { value: 'sin-retorno-2', viewValue: 'Débito' },
    { value: 'adeudado-3', viewValue: 'Crédito' },
    { value: 'finalizada-4', viewValue: 'Cheque' },
  ];
  selectedValue!: string;

  constructor(
    private formResumenArriendo: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

  ngOnInit(): void {

    //this.generatePdf();

    this.resumenArriendoForm = this.formResumenArriendo.group({

      
      /*TABLA DETALLE MAQUINA*/
      
      txtFechaDetArr: [''],
     /* txtFechaDetArr: new FormControl(
      'txtOperarioDetMaqOt',
      Validators.required
    ), */
      txtInicioDetArr: [''],
      txtTerminoDetArr: [''],

  
      /* DATOS DE TABLA */
      

      /* UBICACION */
      

    });

    this.showDataOt();

  }

  showDataOt(){
    console.log("this.data.idOt: ",this.data.idOt);
    
    let jsonDetMaqOt = JSON.parse(localStorage.getItem(this.data.idOt) || '[]');
    console.log("jsonDetMaqOt: ",jsonDetMaqOt);

    
    this.cliNameOt = jsonDetMaqOt.otr_Cli_Id.cli_Nombre;
    this.cliApellidosOt = jsonDetMaqOt.otr_Cli_Id.cli_Apellidos;
    this.cliRazonSocialOt = jsonDetMaqOt.otr_Cli_Id.cli_RazonSocial;
    this.cliRutOt = jsonDetMaqOt.otr_Cli_Id.cli_Rut;
    this.cliContactoOt = jsonDetMaqOt.otr_NombreContacto;
    this.cliEmailOt = jsonDetMaqOt.otr_EmailContacto;
    this.cliTelefonoOt = jsonDetMaqOt.otr_TelefonoContacto;
    this.cliDireccionOt = jsonDetMaqOt.otr_DireccionTrabajo;
    this.cliComunaOt = jsonDetMaqOt.otr_ComunaTrabajo;
    this.cliRegionOt = jsonDetMaqOt.otr_RegionTrabajo;

    for (let x = 0; x < jsonDetMaqOt.otr_Odm_Id.length; x++) {
      const datoJson = jsonDetMaqOt.otr_Odm_Id[x];

      console.log("datoJson: ",datoJson);
      console.log("datoJson.odm_Maq_Id.maq_Codigo: ",datoJson.odm_Maq_Id.maq_Codigo);

      this.listMaq.push({
        code: datoJson.odm_Maq_Id.maq_Codigo,
        nombre: datoJson.odm_Maq_Id.maq_Nombre,
        valorMin: datoJson.odm_ValorMinArriendo,
        precio: datoJson.odm_ValorArriendo,
        tipoPrecio: datoJson.odm_TipoValorMinArriendo,
        implemento:"",
        operario: datoJson.odm_NombreOperario,
        combustible:"",
        cilindro: datoJson.odm_CilindroGas,
        estanque: datoJson.odm_NivelEstanqueSalida,
        traslado: datoJson.otr_Traslado
      });

    //   this.Maq.code = datoJson.odm_Maq_Id.maq_Codigo;
    //   this.Maq.nombre = datoJson.odm_Maq_Id.maq_Nombre;
    //   this.Maq.apellidos = datoJson.odm_Maq_Id.cli_Apellidos;
    //   this.Maq.valorMin = datoJson.odm_Maq_Id.odm_ValorMinArriendo;
    //   this.Maq.precio = datoJson.odm_Maq_Id.odm_ValorArriendo;
    //   this.Maq.tipoPrecio = datoJson.odm_TipoValorMinArriendo;
    //   this.Maq.implemento = "?";
    //   this.Maq.operario = datoJson.odm_NombreOperario;
    //  // this.Maq.combustible = datoJson.
    //   this.Maq.cilindro = datoJson.odm_CilindroGas;
    //   this.Maq.estanque = datoJson.odm_NivelEstanqueSalida;
    //   this.Maq.traslado = datoJson.otr_Traslado;
      
      console.log("this.listMaq: ",this.listMaq);

    }

      
  }


  setResumenArriendo() {
    this.closeDialog();

  }

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
    console.log('close dialog');

  }
}

interface EstadoArriendos {
  value: string;
  viewValue: string;
}

interface Maq{
 // Maq: any = {
    code:string;
    nombre:string;
    valorMin:string;
    precio:string;
    tipoPrecio:string;
    implemento:string;
    operario:string;
    combustible:string;
    cilindro:string;
    estanque:string;
    traslado:string;
 // };
}


export interface DialogData {
  idOt: string;
}
