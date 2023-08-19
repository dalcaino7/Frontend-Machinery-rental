import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { event } from 'jquery';
import { forEach } from 'lodash';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComunasRegiones } from 'src/app/models/comunasRegiones';
import { DetalleMaquinaTemporal } from 'src/app/orden-trabajos/models/detalle-maquina-temporal.model';
import { OrdenTrabajo } from 'src/app/orden-trabajos/models/orden-trabajo';
import { Maquina } from '../../../../../../maquinas/models/maquina';
import { MaquinaService } from '../../../../../../maquinas/services/maquina.service';
import { TipoMaquinaService } from '../../../../../../maquinas/services/tipo-maquina.service';
import { Region } from '../../../../../../models/region';
import { RegionComunaChileService } from '../../../../../../services/region-comuna-chile.service';

@Component({
  selector: 'app-detalle-maquinaria',
  templateUrl: './detalle-maquinaria-dialog.component.html',
  styleUrls: ['./detalle-maquinaria-dialog.component.css'],
})
export class DetalleMaquinariaDialogComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter();
  showValor: boolean = false;
  auxCobroMinimo: string="";
  // validate: string = "true";
  valorMinArriendo: string = ""; // this.maq.maq_ValorMinArriendo
  valorArriendo: string = ""; // this.maq.maq_ValorArriendo

  mapDetalle = new Map<string, any>();

  detMaqTemp: DetalleMaquinaTemporal = new DetalleMaquinaTemporal();

  strIntoObj: Region[] = [];
  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];

  public maq: Maquina = new Maquina();

  selectedValueRegion: string = '';
  selectedValueComuna: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);

  dataSource: any;

  ELEMENT_DATA_DETMAQUINA: detMaquinariaTable[] = [
    {
      operario: '',
      valor: '',
      precio: '',
      implemento: '',
      combustible: '',
      tipoArriendo: '',
      accion: '',
    },
  ];

  toppings = new FormControl();

  implementos: string[] = [];
  /*     'Cortadora rotativa',
    'Escarificador',
    'Perforadora',
    'Sembradora',
    'Aspersora',
    'Rastra',
  ]; */

  Icombustible: IcomboBox[] = [
    { value: '4/4', viewValue: '4/4' },
    { value: '3/4', viewValue: '3/4' },
    { value: '1/2', viewValue: '1/2' },
    { value: '1/4', viewValue: '1/4' },
  ];

  //maq_TipoValorMinArriendo
  ItipoArriendo: IcomboBox[] = [
    { value: 'hora', viewValue: 'hora' },
    { value: 'dia', viewValue: 'dia' },
    { value: 'mes', viewValue: 'mes' },
    { value: 'hectarea', viewValue: 'hectarea' },
  ];

  IFormaTraslado: IcomboBox[] = [
    { value: 'En camión', viewValue: 'En camión' },
    { value: 'Traslado cliente', viewValue: 'Traslado cliente' },
    { value: 'Por un tercero', viewValue: 'Por un tercero' }
  ];

  machineDetailForm: any;

  txtOperarioDetMaqOt = new FormControl();
  filteredOptions!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private tipoMaq: TipoMaquinaService,
    private maqService: MaquinaService,
    public dialog: MatDialog,
    private rgnService: RegionComunaChileService,

    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    console.log("showValor 1: ",this.showValor);
    
    this.listDetalleMaquinaria();

    this.machineDetailForm = this.fb.group({
      txtOperarioDetMaqOt: [''],
      txtValorMinimoDetMaqOt: [''],
      txtPrecioDetMaqOt: [''],
      //selCombustibleDetMaqOt: [''],
      selTipoCobroDetMaqOt:[''],
      checkTrasladoDetOt: [false],
      selFormaTrasladoDetMaqOt:[''],
      txtNombreChoferDetOt:[''],
      txtCostoTrasladoDetOt:[''],
      
      checkCilindroDetOt: [false],
      checkCombustibleDetOt: [false],
      txtNombreContactoDetOt: [''],
      txtTelefonoContactoDetOt: ['',[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      txtEmailContactoDetOt: [''],
      selRegionDetMaq: [''],
      selComunaDetMaq: [''],
      txtDireccionDetOt: [''],
      txtObservacionDetOt:[''],
    });
    

    
    /* MUESTRA LA LISTA DE OPERARIOS */
    // this.filteredOptions = this.txtOperarioDetMaqOt.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value))
    // );


    // if(this.maq.maq_TipoValorMinArriendo=="hectarea"){

    //   this.detMaquinariaTable[] = [
    //     {
    //       operario: '',
    //       precio: '',
    //       implemento: '',
    //       combustible: '',
    //       tipoArriendo: '',
    //       accion: '',
    //     },
    //   ];
      // this.ELEMENT_DATA_DETMAQUINA: detMaquinariaTableHectarea[] = [
      //   {
      //     operario: '',
      //     precio: '',
      //     implemento: '',
      //     combustible: '',
      //     tipoArriendo: '',
      //     accion: '',
      //   },
      // ];
    

  }

  

  listDetalleMaquinaria() {
    this.dataSource = this.ELEMENT_DATA_DETMAQUINA;

    let jsonData = JSON.parse(localStorage.getItem(this.data.codeMachine) || '[]');
      this.maqService.getMaquina(this.data.idMachine).subscribe((m) => {
        this.maq = m;

        
        
        if(!jsonData.codigoMaquina){
            // this.valorMinArriendo = this.maq.maq_ValorMinArriendo;
            // this.valorArriendo = this.maq.maq_ValorArriendo;
            this.machineDetailForm.get(['selTipoCobroDetMaqOt']).setValue(this.maq.maq_TipoValorMinArriendo);
 
            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(this.maq.maq_ValorMinArriendo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(this.maq.maq_ValorArriendo);
            if(this.maq.maq_TipoValorMinArriendo == "mes"){
              this.showValor= false;
              this.auxCobroMinimo = "hora";
            }
            if(this.maq.maq_TipoValorMinArriendo == "hectarea"){
              this.showValor= true;
              this.auxCobroMinimo = "hectarea";
            }
            if(this.maq.maq_TipoValorMinArriendo == "dia"){
              this.showValor= false;
              this.auxCobroMinimo = "dia";
            }
            if(this.maq.maq_TipoValorMinArriendo == "hora"){
              this.showValor= false;
              this.auxCobroMinimo = "hora";
            }
        }
        if(jsonData.codigoMaquina){

          if(jsonData.tipoPrecio == "mes"){
            this.showValor= false;
            this.auxCobroMinimo = "hora";
          }
          if(jsonData.tipoPrecio == "hectarea"){
            this.showValor= true;
            this.auxCobroMinimo = "hectarea";
          }
          if(jsonData.tipoPrecio == "dia"){
            this.showValor= false;
            this.auxCobroMinimo = "dia";
          }
          if(jsonData.tipoPrecio == "hora"){
            this.showValor= false;
            this.auxCobroMinimo = "hora";
          }

          this.machineDetailForm.get('txtOperarioDetMaqOt').setValue(jsonData.operario);
          
          if(!jsonData.valorMinimo || !jsonData.precio){

            // this.valorMinArriendo = this.maq.maq_ValorMinArriendo;
            // this.valorArriendo = this.maq.maq_ValorArriendo;
            
            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(this.maq.maq_ValorMinArriendo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(this.maq.maq_ValorArriendo);
          }else{
            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(jsonData.valorMinimo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(jsonData.precio);
          }
          


          //this.machineDetailForm.get(['selCombustibleDetMaqOt']).setValue(jsonData.combustible);

          

          jsonData.combustible = (String(jsonData.combustible).toLowerCase() === 'true');
          jsonData.traslado = (String(jsonData.traslado).toLowerCase() === 'true');
          jsonData.cilindroGas = (String(jsonData.cilindroGas).toLowerCase() === 'true');

          this.machineDetailForm.get(['selTipoCobroDetMaqOt']).setValue(jsonData.tipoPrecio);

          this.machineDetailForm.get('checkTrasladoDetOt').setValue(jsonData.traslado);
          this.machineDetailForm.get('checkCilindroDetOt').setValue(jsonData.cilindroGas);
          this.machineDetailForm.get('checkCombustibleDetOt').setValue(jsonData.combustible);


          this.machineDetailForm.get(['selFormaTrasladoDetMaqOt']).setValue(jsonData.medioTraslado);
          this.machineDetailForm.get('txtNombreChoferDetOt').setValue(jsonData.nombreChofer);
          this.machineDetailForm.get('txtCostoTrasladoDetOt').setValue(jsonData.costoTraslado);


          this.machineDetailForm.get('txtNombreContactoDetOt').setValue(jsonData.nombreContacto);
          this.machineDetailForm.get('txtTelefonoContactoDetOt').setValue(jsonData.telefonoContacto);
          this.machineDetailForm.get('txtEmailContactoDetOt').setValue(jsonData.emailContacto);
          this.machineDetailForm.get('txtDireccionDetOt').setValue(jsonData.direccion);
          this.machineDetailForm.get('txtObservacionDetOt').setValue(jsonData.observacion);
        }
        
        
        //this.machineDetailForm.get(['selCombustibleDetMaqOt']).setValue("1/4");
       // this.machineDetailForm.get('checkCombustibleDetOt').setValue(jsonData.combustible);


        
        this.rgnService.getListRegiones().subscribe((rgn: ComunasRegiones) => {
          this.strIntoObj = JSON.parse(rgn.rcsDescripcion);
          this.regionSelect = this.strIntoObj;
          this.machineDetailForm.get(['selRegionDetMaq']).setValue(jsonData.region);
          for (let rg of this.regionSelect) {
            if(rg.nombre == jsonData.region){
              this.listComuna(rg.codigo);
              this.machineDetailForm.get(['selComunaDetMaq']).setValue(jsonData.comuna);
            }
          }
        });
      });
  }

  regionFilter($event: any) {
    for (let rg of this.regionSelect) {
      if (rg.nombre === $event.value) {
        this.listComuna(rg.codigo);
      }
    }
  }

  listComuna(cod: string) {    
    this.rgnService.getListComunas(cod).subscribe((cmn: ComunasRegiones) => {
      this.strIntoObj = JSON.parse(cmn.rcsDescripcion);
      this.comunaSelect = this.strIntoObj;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.operariosList.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  cobroPorFilter($event: any){
    console.log("evento: ",$event.value);
    if($event.value == "mes"){
      this.auxCobroMinimo = "hora";
      this.showValor= false;
    }
    if($event.value == "hectarea"){
      this.auxCobroMinimo = "";
      this.showValor= true;
    }
    if($event.value == "dia"){
      this.auxCobroMinimo = "dia";
      this.showValor= false;
    }
    if($event.value == "hora"){
      this.auxCobroMinimo = "hora";
      this.showValor= false;
    }


  }

  // verificaTipoCobro(){
  //   if(this.maq.maq_TipoValorMinArriendo == "mes"){
  //     this.showValor= false;
  //     this.auxCobroMinimo = "hora";
  //     console.log("showValor 2: ",this.showValor);
  //   }
  //   if(this.maq.maq_TipoValorMinArriendo == "hectarea"){
  //     this.showValor= true;
  //     this.auxCobroMinimo = "hectarea";
  //     console.log("showValor 2: ",this.showValor);
  //   }
  //   if(this.maq.maq_TipoValorMinArriendo == "dia"){
  //     this.showValor= false;
  //     this.auxCobroMinimo = "dia";
  //     console.log("showValor 2: ",this.showValor);
  //   }
  //   if(this.maq.maq_TipoValorMinArriendo == "hora"){
  //     this.showValor= false;
  //     this.auxCobroMinimo = "hora";
  //     console.log("showValor 2: ",this.showValor);
  //   }
  // }

  displayedColumnsDetMaquinaria: string[] = [
    'tipoArriendo',
    'valor',
    'precio',
    'operario'
    // 'implemento',
  ];

  deleteCliente() {
    console.log('ELIMINADO');
  }

  operariosList: string[] = [
    'Juan Pablo Moya',
    'Ramón Perez Oyarce',
    'Pedro Ortuza',
    'Daniel Esteban Solis',
    'Marcelo Diaz Lopez',
  ];

  // Initially fill the selectedStates so it can be used in the for loop**
  selectedStates = this.operariosList;
  value: any;

  // Receive user input and send to search method**
  onKey(value: any) {
    this.selectedStates = this.search(value);
  }

  // Filter the states list and send back to populate the selectedStates**
  search(value: string) {
    let filter = value.toLowerCase();
    return this.operariosList.filter((option) =>
      option.toLowerCase().startsWith(filter)
    );
  }

  setDetalleMaquinaria() {

  
    this.detMaqTemp.idMaquina = this.maq.maq_Id.toString();
    this.detMaqTemp.codigoMaquina = this.maq.maq_Codigo;
    this.detMaqTemp.nombreMaquina = this.maq.maq_Nombre;
    this.detMaqTemp.operario = this.machineDetailForm.value.txtOperarioDetMaqOt;
    this.detMaqTemp.valorMinimo = this.machineDetailForm.value.txtValorMinimoDetMaqOt;
    this.detMaqTemp.precio = this.machineDetailForm.value.txtPrecioDetMaqOt;
    this.detMaqTemp.tipoPrecio = this.machineDetailForm.value['selTipoCobroDetMaqOt'];
    

    this.detMaqTemp.traslado    = this.machineDetailForm.value.checkTrasladoDetOt;
    this.detMaqTemp.cilindroGas = this.machineDetailForm.value.checkCilindroDetOt;
    this.detMaqTemp.combustible = this.machineDetailForm.value.checkCombustibleDetOt;


    this.detMaqTemp.medioTraslado = this.machineDetailForm.value['selFormaTrasladoDetMaqOt'];
    this.detMaqTemp.nombreChofer = this.machineDetailForm.value.txtNombreChoferDetOt;
    this.detMaqTemp.costoTraslado = this.machineDetailForm.value.txtCostoTrasladoDetOt;

    this.detMaqTemp.nombreContacto = this.machineDetailForm.value.txtNombreContactoDetOt;
    this.detMaqTemp.telefonoContacto = this.machineDetailForm.value.txtTelefonoContactoDetOt;
    this.detMaqTemp.emailContacto = this.machineDetailForm.value.txtEmailContactoDetOt;
    this.detMaqTemp.region = this.machineDetailForm.value['selRegionDetMaq'];
    this.detMaqTemp.comuna = this.machineDetailForm.value['selComunaDetMaq'];
    this.detMaqTemp.direccion = this.machineDetailForm.value.txtDireccionDetOt;
    this.detMaqTemp.observacion = this.machineDetailForm.value.txtObservacionDetOt;

    localStorage.setItem(this.maq.maq_Codigo, JSON.stringify(this.detMaqTemp));

    this.closeDialog();
  }

  // emitEvent(value: string){
  //   console.log("emit: ",value);
    
  //   this.newItemEvent.emit(value);
  // }

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
  }

 
}


export interface clienteTable {
  rut: string;
  nombre: string;
  comuna: string;
  deleteAction: string;
}

export interface detMaquinariaTable {
  operario: string;
  valor: string;
  precio: string;
  implemento: string;
  combustible: string;
  tipoArriendo: string;
  accion: string;
}

interface IcomboBox {
  value: string;
  viewValue: string;
}


export interface DialogData {
  idMachine: string;
  codeMachine: string;
}
