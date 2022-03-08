import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IngresoDetalleArriendoDialogComponent } from './ingreso-detalle-arriendo/ingreso-detalle-arriendo-dialog.component';

@Component({
  selector: 'app-detalle-arriendo',
  templateUrl: './detalle-arriendo.component.html',
  styleUrls: ['./detalle-arriendo.component.css'],
})
export class DetalleArriendoComponent implements OnInit {
  otForm!: FormGroup;

  dataSourceMaquinaria = ELEMENT_DATA_MAQUINARIA;
  displayedColumnsMaquinaria: string[] = [
    'codigo',
    'nombre',
    'categoria',
    'precio',
    'tipoCobro',
    'acciones',
  ];

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    /* DECLARACION DE FORMULARIO DE OT */
    this.otForm = this.formBuilder.group({
      /* VARIABLES DE MAQUINARIA */
      txtCodigoMaquinaOt: [''],
      txtNombreMaquinaOt: [''],
    });
  }

  procesarOt() {}

  openDialog() {
    const dialogRef = this.dialog.open(IngresoDetalleArriendoDialogComponent, {
      panelClass: 'custom-dialog-container-little',
    });



    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}

export interface maquinariaTable {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  tipoCobro: string;
  acciones: string;
}

const ELEMENT_DATA_MAQUINARIA: maquinariaTable[] = [
  {
    codigo: '0213',
    nombre: 'Grua 01',
    categoria: 'Gruas',
    precio: 6000,
    tipoCobro: 'Hora',
    acciones: '',
  },
  {
    codigo: '1533',
    nombre: 'Camion de remolque 02',
    categoria: 'Camiones',
    precio: 10000,
    tipoCobro: 'Día',
    acciones: '',
  },
  {
    codigo: '1456',
    nombre: 'Rastrillo 01',
    categoria: 'Implementos',
    precio: 2000,
    tipoCobro: 'Día',
    acciones: '',
  },
];
