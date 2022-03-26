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

  dataSourceMaquinaria = ELEMENT_DATA_MAQUINARIA;

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
    private cliService: ClienteService
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
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
 
    if(filterValue){

 

    console.log("rut->",filterValue);
    
    this.dataSourceCliente.filter = filterValue; 

    
    this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
      this.dataSourceCliente.data = cli;
      this.listClientesTabla = cli;
      console.log("cli->",cli);


     /*  cli.forEach(( e: any) => {
        console.log("e.cli_Rut",e.cli_Rut);

        if (filterValue === e.cli_Rut) {
          console.log("filterValue === e.cli_Rut",filterValue," === ", e.cli_Rut);
          console.log("e->",e);
          
         // filterValue = filterValue;
          
      
         

         


        }
        

        
        
        
      }); */

    //  console.log("this.dataSourceCliente.data->",this.dataSourceCliente.data);
      
    });
  }else{
    console.log("vacio: filterValue->",filterValue);
    this.dataSourceCliente.data = [];
  }
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
