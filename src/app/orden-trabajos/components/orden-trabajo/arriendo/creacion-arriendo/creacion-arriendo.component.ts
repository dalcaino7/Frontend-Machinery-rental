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
  otForm!: FormGroup;

  formUbicacion!: FormGroup;

  public toggle_mostrarMapa = false;
  // Configuración de Google Maps
  map = null;
  center: any;
  zoom: any;
  display?: google.maps.LatLngLiteral;
  marker: any;
  listClientesTabla: any = []; //contiene la lista de clientes de la tabla
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

  displayedColumnsCliente: string[] = [
    'rut',
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

  region: regiones[] = [
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

  constructor(
    private formBuilder: FormBuilder,
    public locationService: LocationService,
    public dialog: MatDialog,
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

  

  onFormSubmit() {
    alert(JSON.stringify(this.formUbicacion.value, null, 2));
  }

  deleteCliente() {
    console.log('hola a todos');
  }

  mostrarMapa() {
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

  addCliente() {
    
      const dialogRef = this.dialog.open(CreacionClienteDialogComponent, {
        panelClass: 'custom-dialog-container-big-2',
        data: { modeDialog: 'add'},
      });
    
  }

  addMaquina(){
    const dialogRef = this.dialog.open(CreacionMaquinaDialogComponent, {
      panelClass: 'custom-dialog-container-big-2',
      data: { modeDialog: 'add'},
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
      console.log("entro al else");
      
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

  rutClienteFilter(filterValue: string) {
    let valorEncontrado: string;
    if(filterValue){
      this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
        
        console.log("INICIO");

      
      for(let i = 0; i < cli.length; i++){

        console.log("NO: cli[i].cli_Rut == filterValue->",cli[i].cli_Rut," == ",filterValue);

        if(cli[i].cli_Rut === filterValue ){
          this.dataSourceCliente.filter = filterValue; 

          console.log("ENCONTRO! cli[i].cli_Rut == filterValue->",cli[i].cli_Rut," == ",filterValue);
          this.dataSourceCliente.data = cli;

          valorEncontrado = cli[i].cli_Rut
        }

      }

      if (!valorEncontrado) {
        this.dataSourceCliente.data = [];

      }
      
     


    });
    
  }else{
    this.dataSourceCliente.data = [];
  }
  }

  nombreClienteFilter(filterValue: string){

    let valorEncontrado: string = '';
    
    
    
    if(filterValue){
      this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
        
     
       console.log("INICIO");
       console.log("filterValue->",filterValue);

      for(let i = 0; i < cli.length; i++){

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
  


        console.log("NO: cli[i].cli_Nombre == filterValue->",nombreCompleto," === ",filterValue);

        if(nombreCompleto === filterValue ){
          

          this.dataSourceCliente.data = cli;
          console.log(" this.dataSourceCliente.data->", this.dataSourceCliente.data);
          

          this.dataSourceCliente.filter = filterValue; 
          console.log("this.dataSourceCliente.filter->",this.dataSourceCliente.filter);
          

          console.log("ENCONTRO! nombreCompleto == filterValue->",nombreCompleto," ===",filterValue);

          valorEncontrado = nombreCompleto
        }
      }

      if (!valorEncontrado) {
        this.dataSourceCliente.data = [];

      }
      
     


    });
    
  }else{
    this.dataSourceCliente.data = [];
  }
  }


  /* Se guarda el filtro ingresado por cada evento onKey */
  nombreRutFilter(filterValue: string) {
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
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
