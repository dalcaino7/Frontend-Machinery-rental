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

@Component({
  selector: 'app-arriendo',
  templateUrl: './main-arriendo.component.html',
  styleUrls: ['./main-arriendo.component.css'],
})
export class ArriendoComponent implements AfterViewInit {
  selectedValue: string = '';
  selectedCar: string = '';

  estados: EstadoArriendos[] = [
    { value: 'todos-0', viewValue: 'Todos' },
    { value: 'en-terreno-1', viewValue: 'En Terreno' },
    { value: 'sin-retorno-2', viewValue: 'Sin Retorno' },
    { value: 'adeudado-3', viewValue: 'Adeudado' },
    { value: 'finalizada-4', viewValue: 'Finalizada' },
    { value: 'anulada-5', viewValue: 'Anulada' },
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
  dataSource = new MatTableDataSource<arriendo>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSortModule) sort!: MatSortModule;

  constructor(
    private formDetalleMaqOt: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

export interface arriendo {
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
];
