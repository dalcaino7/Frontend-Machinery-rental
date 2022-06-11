import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { CreacionClienteDialogComponent } from '../creacion-cliente/creacion-cliente-dialog.component';
import { VerClienteDialogComponent } from './ver-cliente/ver-cliente-dialog.component';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import Swal from 'sweetalert2';

import * as _ from 'lodash'; //paquete para el manejo de matrices
import { MatSort } from '@angular/material/sort';
import { RegionComunaChileService } from '../../../services/region-comuna-chile.service';
import { Region } from 'src/app/models/region';
import { Comuna } from 'src/app/models/comuna';

@Component({
  selector: 'app-cliente',
  templateUrl: './main-cliente.component.html',
  styleUrls: ['./main-cliente.component.css'],
})
export class ClienteComponent implements AfterViewInit {
  selectedValueRegion: string = ''; //guarda el nombre de la region
  selectedValueComuna: string = ''; // guarda el nombre de la comuna
  estadoSelectorComuna: boolean = true; // Para des/habilitar selector Comuna
  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];
  //codigoSelectedRegion: string = ''; //guarda el codigo de la region
  cliente: Cliente = new Cliente();
  clientes: Cliente[] = [];
 // selection: any;
  //search: any;
  listClientesTabla: any = []; //contiene la lista de clientes de la tabla

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild('tablaView') table!: MatTable<Cliente>;

  dataSource = new MatTableDataSource<Cliente>(this.clientes);
  displayedColumns: string[] = [
    'rut',
    'razonSocial',
    'nombre',
    'region',
    'comuna',
    'estadoArriendo',
    'estadoMaquina',
    'estadoPago',
    'accion',
  ];

  constructor(
    public dialog: MatDialog,
    private cliService: ClienteService,
    private rgnService: RegionComunaChileService
  ) {}

  ngAfterViewInit() {

    this.listClientes();
    this.listRegiones();
  }

  listRegiones() {
    this.rgnService.getListRegiones().subscribe((rgn: Region[]) => {
      this.regionSelect = rgn;
    });
  }

  listComuna(cod: string) {
    this.rgnService.getListComunas(cod).subscribe((cmn: Comuna[]) => {
      this.comunaSelect = cmn;
    });
  }

  listClientes() {
    this.dataSource.paginator = this.paginator;
    this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
      this.listClientesTabla = cli;
      this.dataSource.data = cli;
    });
    this.dataSource._updateChangeSubscription();


    this.filtroBusquedaTable();
  }

  /* PERMITE RETORNAR NOMBRE Y APELLIDOS JUNTOS PARA LA BUSQUEDA*/
  filtroBusquedaTable() {
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      /*FORMATEA EL TEXTO ELIMINANDO TILDES Y DEJANDO EN MINUSCULA */
      var nombre = data.cli_Nombre
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      var apellido = data.cli_Apellidos
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      var nombreCompleto = nombre.concat(' '.concat(apellido));

      var rsocial = data.cli_RazonSocial
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();


      return (
        data.cli_Rut.toString().toLowerCase().includes(filter) ||
        nombreCompleto.includes(filter) || 
        rsocial.includes(filter)
      );
    };
  }

  addDetalleArriendo() {}

  addCliente() {
    this.openDialog('add');
  }

  openDialog(state: string) {
    if (state == 'add') {
      const dialogRef = this.dialog.open(CreacionClienteDialogComponent, {
        panelClass: 'custom-dialog-container-big-2',
        data: { modeDialog: state},
      });
    }
    if (state == 'mod') {
      const dialogRef = this.dialog.open(CreacionClienteDialogComponent, {
        panelClass: 'custom-dialog-container-big-2',
        data: { modeDialog: state, idClienteDialog: this.cliente.cli_Id },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
    if (state == 'ver') {
      const dialogRef = this.dialog.open(VerClienteDialogComponent, {
        panelClass: 'custom-dialog-container-big-landscape-2',
        data: { idClienteDialog: this.cliente.cli_Id },
      });
    }
  }

  viewCliente(id: string) {
    this.cliente.cli_Id = id;
    this.openDialog('ver');
  }

  updateCliente(id: string) {
    this.cliente.cli_Id = id;
    this.openDialog('mod');
  }

  deleteCliente(id: string) {
    Swal.fire({
      title: '¿Estás Seguro de eliminar a este cliente?',
      text: 'No podrás revertirlo...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cliente.cli_Id = id;
        this.cliService.getCliente(this.cliente.cli_Id).subscribe((cli) => {
          this.cliente = cli;
          this.cliente.cli_Estado = 'Inactivo';
          this.cliService.updateCliente(this.cliente).subscribe(() => {
            Swal.fire({
              title: 'Eliminado!',
              text: 'El cliente ha sido eliminado.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1800,
            });
            setInterval(function () {
              location.reload();
            }, 2000); //actualiza la pagina a los 2seg
          });
        });
      }
    });
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
      let filteredData = _.filter(this.listClientesTabla, (item) => {
        return item;
      });
      this.dataSource.data = filteredData;
    } else {
      /* FILTRO DE BUSQUEDA DE REGION EN TABLA */
      let filteredData = _.filter(this.listClientesTabla, (item) => {
        this.selectedValueRegion;
        return item.cli_Region.toLowerCase() == $event.value.toLowerCase(); // BUSCA SI EXISTE EN LA TABLA EL VALOR SELECCIONADO
      });
      /* MUESTRA TABLA FILTRADA */
      this.dataSource.data = filteredData;
      for (let rg of this.regionSelect) {
        if (rg.nombre === $event.value) {
          this.listComuna(rg.codigo);
        }
      }
    }
  }

  comunaFilter($event: any) {
    if ($event.value.toLowerCase() === 'todos') {
      let filteredData = _.filter(this.listClientesTabla, (item) => {
        return item;
      });
      this.dataSource.data = filteredData;
    } else {
      let filteredData = _.filter(this.listClientesTabla, (item) => {
        return item.cli_Comuna.toLowerCase() == $event.value.toLowerCase();
      });
      this.dataSource.data = filteredData;
    }
  }
}
