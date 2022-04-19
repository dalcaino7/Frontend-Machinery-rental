import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
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
import { data } from 'jquery';
import { OtDetalleMaquina } from '../../../models/ot-detalle-maquina';
import * as moment from 'moment';

@Component({
  selector: 'app-arriendo',
  templateUrl: './main-arriendo.component.html',
  styleUrls: ['./main-arriendo.component.css'],
})

export class ArriendoComponent implements AfterViewInit {
  public date!: Date;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  selectedValueEstado: string = '';
  selectedValue: string = '';
  selectedCar: string = '';
  ordenT: OrdenTrabajo = new OrdenTrabajo();
  ordenTs: OrdenTrabajo[] = [];
  detalleOrdenTrabajo: OtDetalleMaquina = new OtDetalleMaquina();
  detalleOrdenTrabajos: OtDetalleMaquina[] = [];
  validacionRazonSocial: boolean= false;
  listOtTabla: any = []; //contiene la lista de ot de la tabla
  //rangeFormGroup : any;

  estados: EstadoArriendos[] = [
    { value: 'Todos', viewValue: 'Todos' },
    { value: 'Iniciada', viewValue: 'Iniciada' },
    { value: 'En Progreso', viewValue: 'En Progreso' },
    { value: 'Vencida', viewValue: 'Vencida' },
    { value: 'Finalizada', viewValue: 'Finalizada' },
    { value: 'Anulada', viewValue: 'Anulada' },
  ];

  displayedColumns: string[] = [
    'otr_Id',
    'cliente',
    'cli_Comuna',
    'maquina',
    'otr_Estado',
    'otr_FechaHoraCreacionOt',
    'accion',
  ];

  dataSource = new MatTableDataSource<OrdenTrabajo>(this.ordenTs);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSortModule) sort!: MatSortModule;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formMainFilter: FormBuilder,
    private formDetalleMaqOt: FormBuilder,
    public dialog: MatDialog,
    public OtService: OrdenTrabajoService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngAfterViewInit() {

    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.listArriendo();



  }


  listArriendo(){


    this.OtService.getListOt().subscribe((ot: OrdenTrabajo[]) => {

      this.listOtTabla = ot;
      this.dataSource.data = ot;

      console.log("ot->",ot);
      
    
      
      
    });
    this.filtroBusquedaTable();
  }
 


 

  /* PERMITE RETORNAR NOMBRE Y APELLIDOS JUNTOS PARA LA BUSQUEDA, N° OT Y MAQUINA */
  filtroBusquedaTable() {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      /*FORMATEA EL TEXTO ELIMINANDO TILDES Y DEJANDO EN MINUSCULA */

      var maquinarias = [];
      var rsocial = '';

      var nombre = data.otr_Cli_Id.cli_Nombre
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
        
      var apellido = data.otr_Cli_Id.cli_Apellidos
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(); 

      var nombreCompleto = nombre.concat(' '.concat(apellido));

      if(data.otr_Cli_Id.cli_RazonSocial){
        rsocial = data.otr_Cli_Id.cli_RazonSocial
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      }

      for (let i = 0; i < data.otr_Odm_Id.length; i++) { 
          if(data.otr_Odm_Id[i].odm_Maq_Id.maq_Nombre){
            maquinarias[i] = data.otr_Odm_Id[i].odm_Maq_Id.maq_Nombre
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          }
      }

      if(data.otr_Cli_Id.cli_RazonSocial){
          return (
            maquinarias.join(' ').includes(filter)  || data.otr_Id.toString().includes(filter) ||
            rsocial.includes(filter)
          );
      }else{
        return (
          maquinarias.join(' ').includes(filter) || data.otr_Id.toString().includes(filter) ||
          nombreCompleto.includes(filter)
        );
      }
    };
  }

  /* dateRangeFilter($event: any){

    console.log("date->", this.range.value);
    
  } */

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
  
    let dateStart = dateRangeStart.value.toString().replace(/[/]/g,'-');
      
    let dateEnd = dateRangeEnd.value.toString().replace(/[/]/g,'-');

    let filteredData = _.filter(this.listOtTabla, (item) => { // Itera sobre la tabla del modulo main y retorna el arreglo en item

       let check = new Date(Date.parse(item.otr_FechaHoraCreacionOt)).toLocaleDateString('cl', { year: 'numeric', month: '2-digit', day: '2-digit' });
       let dateCheck = check.replace(/[/]/g,'-');
 
      return   moment(dateCheck,"DD-MM-YYYY").isBetween(moment(dateStart,"DD-MM-YYYY"), moment(dateEnd,"DD-MM-YYYY"), null, "[]") 

    });

    this.dataSource.data = filteredData;

  }

  clearStartDate() {
    let filteredData = _.filter(this.listOtTabla, (item) => {
      return item;
    });
    this.dataSource.data = filteredData;

    this.range.patchValue({start:''});
    this.range.patchValue({end:''});
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

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  
}

interface EstadoArriendos {
  value: string;
  viewValue: string;
}
