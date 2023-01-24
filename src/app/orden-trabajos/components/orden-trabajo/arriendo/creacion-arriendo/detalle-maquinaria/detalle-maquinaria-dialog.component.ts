import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComunasRegiones } from 'src/app/models/comunasRegiones';
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

  strIntoObj: Region[] = [];
  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];
  estadoSelectorComuna: boolean = true; // Para des/habilitar selector Comuna

  listClientesTabla: any = []; //contiene la lista de clientes de la tabla

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

  maquinaDetalleForm!: FormGroup;

  implementos: string[] = [];
/*     'Cortadora rotativa',
    'Escarificador',
    'Perforadora',
    'Sembradora',
    'Aspersora',
    'Rastra',
  ]; */

  combustible: Icombustible[] = [
    { value: '44-0', viewValue: '4/4' },
    { value: '34-1', viewValue: '3/4' },
    { value: '12-3', viewValue: '1/2' },
    { value: '14-4', viewValue: '1/4' },
  ];

  //dataArray = [];

  txtOperarioDetMaqOt = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  //region: Region = new Region();

  constructor(
    private tipoMaq: TipoMaquinaService,
    private maqService: MaquinaService,
    private formDetalleMaqOt: FormBuilder, 
    public dialog: MatDialog,
    private rgnService: RegionComunaChileService,
   // private regService: RegionComunaChileService,
   // @Inject(MAT_DIALOG_DATA) public machine: Maquina,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

  ngOnInit(): void {

    this.maqService.getMaquina(parseInt(this.data.codeMachine)).subscribe( m => {
      this.maq = m;

    });

    this.listRegiones();

/*
    this.regService.getListRegiones().subscribe(r => {
      console.log(r);
    });*/


    console.log("this.maq.maq_Tma_Id.tma_Descripcion->",this.maq.maq_Tma_Id.tma_Descripcion);

    


    this.dataSource = this.ELEMENT_DATA_DETMAQUINA;

    this.maquinaDetalleForm = this.formDetalleMaqOt.group({

      /*TABLA DETALLE MAQUINA*/
      
      txtOperarioDetMaqOt: [''],
     
      txtPrecioDetMaqOt: [''],//['$ 3.750 /Hr.'],
      txtValorMinimoDetMaqOt: [''],//['160 Hrs.'],
      

      selImplementoDetMaqOt: [''],
      selCombustibleDetMaqOt: [''],

      /* Check EXTRAS */
      checkTrasladoDetOt: [false],
      checkCilindroDetOt: [false],

      /* DATOS DE CONTACTO */
      txtNombreContactoDetOt: [''],
      txtTelefonoContactoDetOt: [''],
      txtEmailContactoDetOt: [''],

      /* UBICACION */
      selRegionDetOt: [''],
      selComunaDetOt: [''],
      txtDireccionDetOt: [''],
      //toggle_localizacion: ['', Validators.requiredTrue]
    });

    /* MUESTRA LA LISTA DE OPERARIOS */
    this.filteredOptions = this.txtOperarioDetMaqOt.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  listRegiones() {
    this.rgnService.getListRegiones().subscribe((rgn: ComunasRegiones) => {
      this.strIntoObj = JSON.parse(rgn.rcsDescripcion);
      this.regionSelect = this.strIntoObj;
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

  /* onFormSubmit() {
    // alert(JSON.stringify(this.formUbicacion.value, null, 2));
  } */

  displayedColumnsDetMaquinaria: string[] = [
    'operario',
    'valor',
    'precio',
   // 'implemento',
    'combustible'
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
    this.closeDialog();

    console.log('ingreso: ', this.txtOperarioDetMaqOt.value);

  }

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
    console.log('close dialog');

  }
}

interface regiones {
  value: string;
  viewValue: string;
}

interface comunas {
  value: string;
  viewValue: string;
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
  codeMachine: string;
  
}