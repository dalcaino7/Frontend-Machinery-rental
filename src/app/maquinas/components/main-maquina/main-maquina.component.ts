import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import * as _ from 'lodash'; //paquete para el manejo de matrices


import { CreacionMaquinaDialogComponent } from '../creacion-maquina/creacion-maquina-dialog.component';
import { VerMaquinaDialogComponent } from './ver-maquina/ver-maquina-dialog.component';
import { MaquinaService } from '../../services/maquina.service';
import { Maquina } from '../../models/maquina';

@Component({
  selector: 'app-main-maquina',
  templateUrl: './main-maquina.component.html',
  styleUrls: ['./main-maquina.component.css'],
})
export class MainMaquinaComponent implements AfterViewInit {
  selectedValueEstado: string = '';
  selectedCar: string = '';
  listMaquinasTabla: any = []; //contiene la lista de clientes de la tabla
  maquinas: Maquina[] = [];
  MaquinaSelect: any[] = []; //Muestra la lista del select en el template
  maquina: Maquina = new Maquina();

  estados: EstadoMaquina[] = [
    { value: 'Disponible', viewValue: 'Disponible' },
    { value: 'Arrendada', viewValue: 'Arrendada' },
    { value: 'Mantención', viewValue: 'Mantención' },
    { value: 'Reparación', viewValue: 'Reparación' },
    { value: 'Baja', viewValue: 'Baja' },
    { value: 'Vendida', viewValue: 'Vendida' },
  ];

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'marca',
    'tipoCobro',
    'estado',
    'mantencion',
    'accion',
  ];
  dataSource = new MatTableDataSource<Maquina>(this.maquinas);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSortModule) sort!: MatSortModule;

  constructor(
    private formDetalleMaqOt: FormBuilder,
    public dialog: MatDialog,
    private MaqService: MaquinaService,

  ) {}

  ngAfterViewInit() {
    this.listMaquinas();

  }

  listMaquinas() {
    this.dataSource.paginator = this.paginator;
    this.MaqService.getListMaquinas().subscribe((maq: Maquina[]) => {
      this.listMaquinasTabla = maq;
      this.dataSource.data = maq;
    });



   // this.filtroBusquedaTable();
  }

  updateMaquina(id: number) {
    this.maquina.maq_Id = id;
    this.openDialog('mod');
  }

  /* Se guarda el filtro ingresado por cada evento onKey */
  nombreRutFilter(filterValue: string) {
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
    filterValue = filterValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  regionFilter($event: any) {
    if ($event.value.toLowerCase() === 'todos') {
      let filteredData = _.filter(this.listMaquinasTabla, (item) => {
        return item;
      });
      this.dataSource.data = filteredData;
    } else {
      /* FILTRO DE BUSQUEDA DE ESTADO EN TABLA */
      let filteredData = _.filter(this.listMaquinasTabla, (item) => {
        this.selectedValueEstado;
        return item.ema_Id.ema_Descripcion.toLowerCase() == $event.value.toLowerCase(); // BUSCA SI EXISTE EN LA TABLA EL VALOR SELECCIONADO
      });
      /* MUESTRA TABLA FILTRADA */
      this.dataSource.data = filteredData;
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addDetalleArriendo() {}

  addMaquina() {
    this.openDialog('add');
  }

  openDialog(state: string) {

    if (state == 'add') {
      const dialogRef = this.dialog.open(CreacionMaquinaDialogComponent, {
        panelClass: 'custom-dialog-container-big',
        data: { modeDialog: state},

      });
      
    } 
    if (state == 'mod') {
    //  console.log("maq: ",this.maquina.maq_Id);
      
      const dialogRef = this.dialog.open(CreacionMaquinaDialogComponent, {
        panelClass: 'custom-dialog-container-big',
        data: { modeDialog: state, idMaquinaDialog: this.maquina.maq_Id },
      });
  
      dialogRef.afterClosed().subscribe((result) => {});

    }
    if (state == 'ver') {
      const dialogRef = this.dialog.open(VerMaquinaDialogComponent, {
        panelClass: 'custom-dialog-container-big-landscape',
        data: { idMaquinaDialog: this.maquina.maq_Id},
      });
  
      
    }
  }

  viewCliente(id: number) {
    this.maquina.maq_Id = id;
    this.openDialog('ver');
  }
  modificar() {
    this.openDialog('mod');
  }

  eliminar() {
    if (confirm('¿Está seguro de eliminar esta máquina?')) {
    }
  }
}

interface EstadoMaquina {
  value: string;
  viewValue: string;
}

export interface maquina {
  codigo: number;
  nombre: string;
  marca: string;
  tipoCobro: string;
  estado: string;
  mantencion: string;
  accion: string;
}

const ELEMENT_DATA: maquina[] = [
  {
    codigo: 234,
    nombre: 'Grua 01',
    marca: 'Ford',
    tipoCobro: 'Hora',
    estado: 'Arrendada',
    mantencion: 'cada 300 hrs',
    accion: 'Eliminar',
  },
  {
    codigo: 342,
    nombre: 'Camión remolque 02',
    marca: 'Nissan',
    tipoCobro: 'Día',
    estado: 'Disponible',
    mantencion: 'cada 10.000 KM',
    accion: 'Eliminar',
  },
  {
    codigo: 2077,
    nombre: 'Tractor 04',
    marca: 'Yamaha',
    tipoCobro: 'Hectaria',
    estado: 'Reparación',
    mantencion: 'cada 2 años',
    accion: 'Eliminar',
  },
  {
    codigo: 1004,
    nombre: 'Brazo rastra 01',
    marca: 'Suzu',
    tipoCobro: 'día',
    estado: 'Mantención',
    mantencion: 'Cada 1 año',
    accion: 'Eliminar',
  },
  {
    codigo: 234,
    nombre: 'Grua 02',
    marca: 'Ford',
    tipoCobro: 'Hora',
    estado: 'Arrendada',
    mantencion: 'cada 300 hrs',
    accion: 'Eliminar',
  },
  {
    codigo: 342,
    nombre: 'Camión remolque 02',
    marca: 'Nissan',
    tipoCobro: 'Día',
    estado: 'Disponible',
    mantencion: 'cada 10.000 KM',
    accion: 'Eliminar',
  },
  {
    codigo: 1001,
    nombre: 'Tractor 04',
    marca: 'Yamaha',
    tipoCobro: 'Hectaria',
    estado: 'Reparación',
    mantencion: 'cada 2 años',
    accion: 'Eliminar',
  },
  {
    codigo: 1004,
    nombre: 'Brazo rastra 01',
    marca: 'Suzu',
    tipoCobro: 'día',
    estado: 'Mantención',
    mantencion: 'Cada 1 año',
    accion: 'Eliminar',
  },
];


