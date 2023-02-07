import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forEach } from 'lodash';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComunasRegiones } from 'src/app/models/comunasRegiones';
import { DetalleMaquinaTemporal } from 'src/app/orden-trabajos/models/detalle-maquina-temporal.model';
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

  combustible: Icombustible[] = [
    { value: '4/4', viewValue: '4/4' },
    { value: '3/4', viewValue: '3/4' },
    { value: '1/2', viewValue: '1/2' },
    { value: '1/4', viewValue: '1/4' },
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
    this.machineDetailForm = this.fb.group({
      txtOperarioDetMaqOt: [''],
      txtValorMinimoDetMaqOt: [''],
      txtPrecioDetMaqOt: [''],
      selCombustibleDetMaqOt: [''],
      checkTrasladoDetOt: [false],
      checkCilindroDetOt: [false],
      txtNombreContactoDetOt: [''],
      txtTelefonoContactoDetOt: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      txtEmailContactoDetOt: ['', Validators.email],
      selRegionDetMaq: ['', Validators.required],
      selComunaDetMaq: ['', Validators.required],
      txtDireccionDetOt: [''],
    });
    
    this.dataSource = this.ELEMENT_DATA_DETMAQUINA;

    /* MUESTRA LA LISTA DE OPERARIOS */
    // this.filteredOptions = this.txtOperarioDetMaqOt.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value))
    // );
    this.listDetalleMaquinaria();


  }

  



  listDetalleMaquinaria() {
    let jsonData = JSON.parse(localStorage.getItem(this.data.codeMachine) || '[]');
      this.maqService.getMaquina(parseInt(this.data.idMachine)).subscribe((m) => {
        this.maq = m;
        
      

        if(!jsonData.codigoMaquina){
          console.log("1. if(!jsonData.codigoMaquina){");
            // this.valorMinArriendo = this.maq.maq_ValorMinArriendo;
            // this.valorArriendo = this.maq.maq_ValorArriendo;
            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(this.maq.maq_ValorMinArriendo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(this.maq.maq_ValorArriendo);
        }
        if(jsonData.codigoMaquina){
          console.log("2. if(jsonData.codigoMaquina){){");

          this.machineDetailForm.get('txtOperarioDetMaqOt').setValue(jsonData.operario);
          if(!jsonData.valorMinimo || !jsonData.precio){
            console.log("3. if(!jsonData.valorMinimo || !jsonData.precio)");

            // this.valorMinArriendo = this.maq.maq_ValorMinArriendo;
            // this.valorArriendo = this.maq.maq_ValorArriendo;
            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(this.maq.maq_ValorMinArriendo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(this.maq.maq_ValorArriendo);
          }else{
            console.log("3. ELSE -> if(!jsonData.valorMinimo || !jsonData.precio)");

            this.machineDetailForm.get('txtValorMinimoDetMaqOt').setValue(jsonData.valorMinimo);
            this.machineDetailForm.get('txtPrecioDetMaqOt').setValue(jsonData.precio);
          }
          this.machineDetailForm.get(['selCombustibleDetMaqOt']).setValue(jsonData.combustible);
          this.machineDetailForm.get(['checkTrasladoDetOt']).setValue(jsonData.traslado);
          this.machineDetailForm.get(['checkCilindroDetOt']).setValue(jsonData.cilindroGas);
          this.machineDetailForm.get('txtNombreContactoDetOt').setValue(jsonData.nombreContacto);
          this.machineDetailForm.get('txtTelefonoContactoDetOt').setValue(jsonData.telefonoContacto);
          this.machineDetailForm.get('txtEmailContactoDetOt').setValue(jsonData.emailContacto);
          this.machineDetailForm.get('txtDireccionDetOt').setValue(jsonData.direccion);
        }
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

  displayedColumnsDetMaquinaria: string[] = [
    'operario',
    'valor',
    'precio',
    // 'implemento',
    'combustible',
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
    this.detMaqTemp.codigoMaquina = this.maq.maq_Codigo;
    this.detMaqTemp.operario = this.machineDetailForm.value.txtOperarioDetMaqOt;
    this.detMaqTemp.valorMinimo = this.machineDetailForm.value.txtValorMinimoDetMaqOt;
    this.detMaqTemp.precio = this.machineDetailForm.value.txtPrecioDetMaqOt;
    this.detMaqTemp.combustible = this.machineDetailForm.value['selCombustibleDetMaqOt'];
    this.detMaqTemp.traslado = this.machineDetailForm.value.checkTrasladoDetOt;
    this.detMaqTemp.cilindroGas = this.machineDetailForm.value.checkCilindroDetOt;
    this.detMaqTemp.nombreContacto = this.machineDetailForm.value.txtNombreContactoDetOt;
    this.detMaqTemp.telefonoContacto = this.machineDetailForm.value.txtTelefonoContactoDetOt;
    this.detMaqTemp.emailContacto = this.machineDetailForm.value.txtEmailContactoDetOt;
    this.detMaqTemp.region = this.machineDetailForm.value['selRegionDetMaq'];
    this.detMaqTemp.comuna = this.machineDetailForm.value['selComunaDetMaq'];
    this.detMaqTemp.direccion = this.machineDetailForm.value.txtDireccionDetOt;
 
    localStorage.setItem(this.maq.maq_Codigo, JSON.stringify(this.detMaqTemp));

    console.log("this.machineDetailForm.value.txtValorMinimoDetMaqOt: ", this.machineDetailForm.value.txtValorMinimoDetMaqOt);

    console.log("this.detMaqTemp.valorMinimo : ", this.detMaqTemp.valorMinimo );

    // this.emitEvent(this.validate);

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
  accion: string;
}

interface Icombustible {
  value: string;
  viewValue: string;
}

export interface DialogData {
  idMachine: string;
  codeMachine: string;
}
