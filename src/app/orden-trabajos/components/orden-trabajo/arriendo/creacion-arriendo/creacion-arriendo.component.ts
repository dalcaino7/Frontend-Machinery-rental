import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LocationService } from '../../../../../services/location.service';
import { AnyObject } from 'chart.js/types/basic';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DetalleMaquinariaDialogComponent } from './detalle-maquinaria/detalle-maquinaria-dialog.component';
import { ResumenArriendoDialogComponent } from './resumen-arriendo/resumen-arriendo-dialog.component';
import { CreacionClienteDialogComponent } from '../../../../../clientes/components/creacion-cliente/creacion-cliente-dialog.component';
import { CreacionMaquinaDialogComponent } from '../../../../../maquinas/components/creacion-maquina/creacion-maquina-dialog.component';
import { ClienteService } from '../../../../../clientes/services/cliente.service';
import { Cliente } from 'src/app/clientes/models/cliente';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Maquina } from '../../../../../maquinas/models/maquina';
import { MaquinaService } from '../../../../../maquinas/services/maquina.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { data } from 'jquery';
import { RegionComunaChileService } from 'src/app/services/region-comuna-chile.service';
import { Region } from 'src/app/models/region';
import { Comuna } from 'src/app/models/comuna';

@Component({
  selector: 'app-creacion-arriendo',
  templateUrl: './creacion-arriendo.component.html',
  styleUrls: ['./creacion-arriendo.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CreacionArriendoComponent implements OnInit {
  txtRutCliente = new FormControl();
  public cli: Cliente = new Cliente();

  otForm!: FormGroup;

  formUbicacion!: FormGroup;

  public toggle_mostrarMapa = false;

  // Configuración de Google Maps
  map = null;
  center: any;
  zoom: any;
  display?: google.maps.LatLngLiteral;
  marker: any;

  clientes: Cliente[] = [];
  maquinas: Maquina[] = [];

  // Configuración de combobox de direcciones
  selectedValueRegion: string = '';
  selectedValueComuna: string = '';
  /*   email = new FormControl('', [Validators.required, Validators.email]);
   */

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  tercerFormGroup!: FormGroup;

  //dataSourceCliente = ELEMENT_DATA_CLIENTE;
  dataSourceCliente = new MatTableDataSource<Cliente>(this.clientes);
  
  //dataSourceMaquinaria = new MatTableDataSource<Maquina>(this.maquinas);
  dataSourceMaquinaria = ELEMENT_DATA_MAQUINARIA;

  listaMaquinasOptions!: Observable<string[]>;
  filteredClienteList!: Observable<string[]>;

  //listClientes_flag: any = []; //contiene la lista de clientes de la tabla
  listClientesListInput: any = [];
  //matrizClientesColumn: any = [];
  //clienteList: any = [];
 /*  clienteList: any = [
    '11111111-1 | Juan Pablo Moya',
    '12345567-7 | Ramón Perez Oyarce',
    '33456345-2 | Pedro Ortuza',
    '22333444-5 | Daniel Esteban Solis',
    '1111222-3 | Marcelo Diaz Lopez',
  ]; */

  displayedColumnsCliente: string[] = [
    'rut',
    'razonSocial',
    'nombre',
    'comuna',
    'deleteAction',
  ];

  displayedColumnsMaquinaria: string[] = [
    'codigo',
    'nombre',
    'valorMinimo',
    'precio',
    'tipoCobro',
    'acciones',
  ];

  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];

 /*  region: regiones[] = [
    { value: 'arica-0', viewValue: 'Arica' },
    { value: 'iquique-1', viewValue: 'iquique' },
    { value: 'antofagasta-2', viewValue: 'antofagasta' },
    { value: 'valparaiso-3', viewValue: 'Valparaiso' },
    { value: 'metropolitana-4', viewValue: 'Región Metropolitana' },
    { value: 'ohiggins-5', viewValue: 'Libertador Bernardo Ohiggins' },
  ];

  comuna: comunas[] = [
    { value: 'algarrobo-0', viewValue: 'algarrobo' },
    { value: 'alhue-1', viewValue: 'Alhue' },
    { value: 'camarones-2', viewValue: 'camarones' },
    { value: 'hualpen-3', viewValue: 'hualpen' },
    { value: 'independencia-4', viewValue: 'independencia' },
    { value: 'lagranja-5', viewValue: 'la granja' },
    { value: 'mostazal-5', viewValue: 'mostazal' },
  ];
 */

  constructor(
    private formBuilder: FormBuilder,
    public locationService: LocationService,
    public dialog: MatDialog,
    private rgnService: RegionComunaChileService,
    private cliService: ClienteService,
    private maqService: MaquinaService
  ) {
    this.formUbicacion = formBuilder.group({
      select_region: '',
      select_comuna: '',
      input_direccion: '',
      toggle_localizacion: ['', Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.listRegiones();

    this.cliService.getListClientes().subscribe((cli) => {
      
      this.listClientesListInput = cli;
    
      for (let i = 0; i < cli.length; i++) {
        
        if (!cli[i].cli_RazonSocial || cli[i].cli_RazonSocial === null) {
          this.listClientesListInput[i] =
            cli[i].cli_Rut +
            '  '+' | ' +'  '+
            cli[i].cli_Nombre +
            ' ' +
            cli[i].cli_Apellidos;
        } else {
          this.listClientesListInput[i] =
            cli[i].cli_Rut +
            '  '+' | ' +'  '+
            cli[i].cli_RazonSocial +
            '  '+' | ' +'  '+
            cli[i].cli_Nombre +
            ' ' +
            cli[i].cli_Apellidos; 
            
        }
      }
      //console.log('this.listClientes_flag FINAL->', this.listClientesList);
      console.log("listClientesList[][]->",this.listClientesListInput);

    });

    this.filteredClienteList = this.txtRutCliente.valueChanges.pipe(
      startWith(''),
      map(
        (value) =>
          //console.log("value->",this._filter(value))
          this._filter(value) //va al metodo filter
      )
    );

    /* DECLARACION DE FORMULARIO DE OT */
    this.otForm = this.formBuilder.group({
      /* VARIABLES DE ORDEN DE TRABAJO */
      txtNumeroOt: [''],
      txtReferenciaOt: [''],
      txtFechaOt: [''],

      /* VARIABLES DE CLIENTE */
      txtRutClienteOt: [''],
      txtNombreClienteOt: [''],
      txtNombreContactoClienteOt: [''],
      txtTelefonoContactoClienteOt: [''],
      txtEmailContactoClienteOt: [''],
      txtRegionContactoClienteOt: [''],
      txtComunaContactoClienteOt: [''],
      txtDireccionContactoClienteOt: [''],

      /* VARIABLES DE MAQUINARIA */
      txtCodigoMaquinaOt: [''],
      txtNombreMaquinaOt: [''],
    });

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.tercerFormGroup = this.formBuilder.group({
      tercerCtrl: ['', Validators.required],
    });
  }

  listRegiones() {
    this.rgnService.getListRegiones().subscribe((rgn: Region[]) => {
      this.regionSelect = rgn;      
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
    this.rgnService.getListComunas(cod).subscribe((cmn: Comuna[]) => {
      this.comunaSelect = cmn;
    });
  }

  showCliente(dataCliente: any){

  this.txtRutCliente.setValue('');
   let rutSearch = dataCliente.substring(0,12).replace('|',' ').trim();
    this.cliService.getListClientes().subscribe((cli) => {
    for (let i = 0; i < cli.length; i++) {
      if(cli[i].cli_Rut == rutSearch){
        this.dataSourceCliente.filter = cli[i].cli_Rut
        this.dataSourceCliente.data = cli
      }
    }
    });
  }

  /* metodo que entra en el init */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
   // console.log('_filter');

    //console.log('this.clienteList->', this.listClientes_flag);
    
    return this.listClientesListInput.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onFormSubmit() {
    alert(JSON.stringify(this.formUbicacion.value, null, 2));
  }

  deleteCliente() {
    this.dataSourceCliente.data = [];
  }

 /*  mostrarMapa() {
    if (this.toggle_mostrarMapa) {
      let location = this.getLocation();
      this.toggle_mostrarMapa = true;
    }
  }

  getLocation() {
    this.locationService.getPosition().then((pos) => {
      // Configuración de Google Maps
      this.center = { lat: pos.lat, lng: pos.lng }; //pos-lat y pos.lng obtiene la latitud y longitud del mapa
      this.zoom = 16;
      this.marker = {
        position: { lat: pos.lat, lng: pos.lng },
      };
    });
  }
 */
  addCliente() {
    const dialogRef = this.dialog.open(CreacionClienteDialogComponent, {
      panelClass: 'custom-dialog-container-big-2',
      data: { modeDialog: 'add' },
    });
  }

  addMaquina() {
    const dialogRef = this.dialog.open(CreacionMaquinaDialogComponent, {
      panelClass: 'custom-dialog-container-big-3',
      data: { modeDialog: 'add' },
    });
  }

  openDialog(x: string) {
    if (x == 'resumen') {
      const dialogRef = this.dialog.open(ResumenArriendoDialogComponent, {
        panelClass: 'custom-dialog-container-medium',
      });
      console.log('open dialog');
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      console.log('entro al else');

      const dialogRef = this.dialog.open(DetalleMaquinariaDialogComponent, {
        panelClass: 'custom-dialog-container-big',
      });
      console.log('open dialog');
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
  procesarOt() {
    // confirm('Está seguro de finalizar?');
    this.openDialog('resumen');
  }

  /* rutClienteFilter(filterValue: string) {
    let valorEncontrado: string;
    if (filterValue) {
      this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
        for (let i = 0; i < cli.length; i++) {
          //  console.log("NO: cli[i].cli_Rut == filterValue->",cli[i].cli_Rut," == ",filterValue);

          if (cli[i].cli_Rut === filterValue) {
            this.dataSourceCliente.filter = filterValue;

            //console.log("ENCONTRO! cli[i].cli_Rut == filterValue->",cli[i].cli_Rut," == ",filterValue);
            this.dataSourceCliente.data = cli;

            valorEncontrado = cli[i].cli_Rut;
          }
        }

        if (!valorEncontrado) {
          this.dataSourceCliente.data = [];
        }
      });
    } else {
      this.dataSourceCliente.data = [];
    }
  } */

  busquedaClienteFilter(filterValue: string) {
   /*  let valorEncontrado: string = '';

    if (filterValue) {


      this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
        console.log('CLI->', cli);

        console.log('INICIO');
        console.log('filterValue->', filterValue);

        for (let i = 0; i < cli.length; i++) {
          var rut = cli[i].cli_Rut;

          var nombre = cli[i].cli_Nombre
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

          var apellido = cli[i].cli_Apellidos
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

          var nombreCompleto = nombre.concat(' '.concat(apellido));

          console.log(
            'NO: cli[i].cli_Nombre == filterValue->',
            nombreCompleto,
            ' === ',
            filterValue
          );
          console.log('rut->', rut, ' === ', filterValue);

          if (nombreCompleto === filterValue) {
            this.dataSourceCliente.data = cli;
            console.log(
              ' this.dataSourceCliente.data->',
              this.dataSourceCliente.data
            );

            this.dataSourceCliente.filter = filterValue;
            console.log(
              'this.dataSourceCliente.filter->',
              this.dataSourceCliente.filter
            );

            console.log(
              'ENCONTRO! nombreCompleto == filterValue->',
              nombreCompleto,
              ' ===',
              filterValue
            );

            valorEncontrado = nombreCompleto;
          }
        }

        if (!valorEncontrado) {
          this.dataSourceCliente.data = [];
        }
      });
    } else {
      this.dataSourceCliente.data = [];
    } */
  }

  /* Se guarda el filtro ingresado por cada evento onKey */
  nombreRutFilter(filterValue: string) {
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
    console.log('nombreRutFilter');

    filterValue = filterValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    // this.dataSourceMaquinaria.filter = filterValue;

    /* MUESTRA LA LISTA DE OPERARIOS */
    /* filterValue = this.txtOperarioDetMaqOt.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    ); */
    /* this.maqService.getListMaquinas().subscribe( (m: any) =>




) */
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

const ELEMENT_DATA_CLIENTE: clienteTable[] = [
  {
    rut: '12.345.987-9',
    nombre: 'Municipalidad Paine',
    comuna: 'Paine',
    deleteAction: '',
  },
];

export interface maquinariaTable {
  codigo: string;
  nombre: string;
  valorMinimo: string;
  precio: number;
  tipoCobro: string;
  acciones: string;
}

const ELEMENT_DATA_MAQUINARIA: maquinariaTable[] = [
  {
    codigo: '0213',
    nombre: 'Grua 01',
    valorMinimo: '160 Hrs.',
    precio: 6000,
    tipoCobro: 'Hora',
    acciones: '',
  },
  {
    codigo: '1533',
    nombre: 'Camion de remolque 02',
    valorMinimo: '1 día',
    precio: 10000,
    tipoCobro: 'Día',
    acciones: '',
  },
  {
    codigo: '1456',
    nombre: 'Rastrillo 01',
    valorMinimo: '1 día',
    precio: 2000,
    tipoCobro: 'Día',
    acciones: '',
  },
];
