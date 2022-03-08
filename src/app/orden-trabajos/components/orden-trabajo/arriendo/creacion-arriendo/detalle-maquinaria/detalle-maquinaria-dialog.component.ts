import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AnyObject } from 'chart.js/types/basic';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-maquinaria',
  templateUrl: './detalle-maquinaria-dialog.component.html',
  styleUrls: ['./detalle-maquinaria-dialog.component.css'],
})
export class DetalleMaquinariaDialogComponent implements OnInit {
  /*  public toggle_mostrarMapa = false;
  // Configuración de Google Maps
  map = null;
  center: any;
  zoom: any;
  display?: google.maps.LatLngLiteral;
  marker: any; */

  // Configuración de combobox de direcciones

  selectedValueRegion: string = '';
  selectedValueComuna: string = '';

  email = new FormControl('', [Validators.required, Validators.email]);

  /* firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  tercerFormGroup!: FormGroup; */

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

  implementos: string[] = [
    'Cortadora rotativa',
    'Escarificador',
    'Perforadora',
    'Sembradora',
    'Aspersora',
    'Rastra',
  ];

  combustible: Icombustible[] = [
    { value: '44-0', viewValue: '4/4' },
    { value: '34-1', viewValue: '3/4' },
    { value: '12-3', viewValue: '1/2' },
    { value: '14-4', viewValue: '1/4' },
  ];

  dataArray = [];

  txtOperarioDetMaqOt = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  constructor(private formDetalleMaqOt: FormBuilder,public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = this.ELEMENT_DATA_DETMAQUINA;

    this.maquinaDetalleForm = this.formDetalleMaqOt.group({
      /*TABLA DETALLE MAQUINA*/
      txtOperarioDetMaqOt: new FormControl(
        'txtOperarioDetMaqOt',
        Validators.required
      ),
      txtPrecioDetMaqOt: ['$ 3.750 /Hr.'],
      txtValorMinimoDetMaqOt: ['160 Hrs.'],
      

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
    'implemento',
    'combustible',
    'accion',
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

    console.log('ingreso: ', this.txtOperarioDetMaqOt.value);

    this.closeDialog();
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
