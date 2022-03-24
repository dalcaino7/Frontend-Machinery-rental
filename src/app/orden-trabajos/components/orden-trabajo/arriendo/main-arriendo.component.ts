import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ResumenArriendoDialogComponent } from './creacion-arriendo/resumen-arriendo/resumen-arriendo-dialog.component';
import { OrdenTrabajoService } from '../../../services/orden-trabajo.service';
import { OrdenTrabajo } from '../../../models/orden-trabajo';
import * as _ from 'lodash'; //paquete para el manejo de matrices

@Component({
  selector: 'app-arriendo',
  templateUrl: './main-arriendo.component.html',
  styleUrls: ['./main-arriendo.component.css'],
})
export class ArriendoComponent implements AfterViewInit {
  selectedValueEstado: string = '';

  selectedValue: string = '';
  selectedCar: string = '';
  ordenT: OrdenTrabajo = new OrdenTrabajo();
  ordenTs: OrdenTrabajo[] = [];

  listOtTabla: any = []; //contiene la lista de ot de la tabla

  estados: EstadoArriendos[] = [
    { value: 'Todos', viewValue: 'Todos' },
    { value: 'Iniciada', viewValue: 'Iniciada' },
    { value: 'En Progreso', viewValue: 'En Progreso' },
    { value: 'Vencida', viewValue: 'Vencida' },
    { value: 'Finalizada', viewValue: 'Finalizada' },
    { value: 'Anulada', viewValue: 'Anulada' },
  ];

  displayedColumns: string[] = [
    'ot',
    'cliente',
    'comuna',
    'maquina',
    'estado',
    'fecha',
    'accion',
  ];
  dataSource = new MatTableDataSource<OrdenTrabajo>(this.ordenTs);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSortModule) sort!: MatSortModule;

  constructor(
    private formDetalleMaqOt: FormBuilder,
    public dialog: MatDialog,
    public OtService: OrdenTrabajoService
  ) {}

  ngAfterViewInit() {
    this.listArriendo();
  }

  listArriendo(){
    this.dataSource.paginator = this.paginator;
    this.OtService.getListOt().subscribe((ot: OrdenTrabajo[]) => {
      this.listOtTabla = ot;

      console.log(this.listOtTabla);
      
      /* for(let i=0; i < this.listOtTabla.length; i++ ){
        console.log(ot);

        if(this.listOtTabla[i].maq_LimiteMantencion === null ){
          this.listOtTabla[i].maq_LimiteMantencion = '';
        }
        if(this.listOtTabla[i].maq_ValorRenovacion === null  ){
          this.listOtTabla[i].maq_ValorRenovacion = '';
        }
        if(this.listOtTabla[i].maq_ValorMinArriendo === null){
          this.listOtTabla[i].maq_ValorMinArriendo = '';
        }
        if(this.listOtTabla[i].maq_UltKmHm === null ){
          this.listOtTabla[i].maq_UltKmHm = '';
        }
      } */
      this.dataSource.data = ot;
    });

  }
 
  
  estadoFilter($event: any) {
    if ($event.value.toLowerCase() === 'todos') {
      let filteredData = _.filter(this.listOtTabla, (item) => {
        return item;
      });
      this.dataSource.data = filteredData;
    } else {
      /* FILTRO DE BUSQUEDA DE ESTADO EN TABLA */
      let filteredData = _.filter(this.listOtTabla, (item) => { // Itera sobre la tabla del modulo main y retorna el arreglo en item
        this.selectedValueEstado;
        return item.otr_Estado.toLowerCase() == $event.value.toLowerCase(); // BUSCA SI EXISTE EN LA TABLA EL VALOR SELECCIONADO
      });
      /* MUESTRA TABLA FILTRADA */
      this.dataSource.data = filteredData;
    }
  }

  /* Se guarda el filtro ingresado por cada evento onKey */
  otClienteMaquinaFilter(filterValue: string) {
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
    filterValue = filterValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addDetalleArriendo() {}

  finalizar() {
    if (confirm('¿Está seguro de finalizar esta orden de Arriendo?'))
      this.openDialog();
  }

  anular() {
    confirm('¿Está seguro de anular la orden de Arriendo N° 234?');
  }

  openDialog() {
    const dialogRef = this.dialog.open(ResumenArriendoDialogComponent, { panelClass: 'custom-dialog-container-medium' });
    console.log('open dialog');
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  
}

interface EstadoArriendos {
  value: string;
  viewValue: string;
}

/* export interface arriendo {
  ot: number;
  cliente: string;
  comuna: string;
  maquina: string;
  estado: string;
  fecha: string;
  accion: string;
}

const ELEMENT_DATA: arriendo[] = [
  {
    ot: 234,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'En Terreno',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 345,
    cliente: 'Municipalidad Mostazal',
    comuna: 'Mostazal',
    maquina: 'Grua 02',
    estado: 'Adeudada',
    fecha: '04/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 344,
    cliente: 'Juan Perez',
    comuna: 'Graneros',
    maquina: 'Camion 01',
    estado: 'Sin Retorno',
    fecha: '05/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 432,
    cliente: 'Agricola San jose',
    comuna: 'Linderos',
    maquina: 'Tractor 01',
    estado: 'Finalizada',
    fecha: '06/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 6,
    cliente: 'Gustavo Urzua',
    comuna: 'Santiago',
    maquina: 'Grua 01',
    estado: 'Anulada',
    fecha: '07/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 4,
    cliente: 'Municipalidad Paine',
    comuna: 'Macul',
    maquina: 'Grua 04',
    estado: 'Arrendada',
    fecha: '09/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 64,
    cliente: 'Municipalidad Paine',
    comuna: 'Rancagua',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 66,
    cliente: 'Municipalidad Paine',
    comuna: 'ÑuÑoa',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 7544,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 987,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 566,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 333,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 664,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 33,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 675,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 487,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 123,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 11,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
  {
    ot: 1,
    cliente: 'Municipalidad Paine',
    comuna: 'Paine',
    maquina: 'Grua 01',
    estado: 'Arrendada',
    fecha: '02/11/2021',
    accion: 'Eliminar',
  },
]; */
