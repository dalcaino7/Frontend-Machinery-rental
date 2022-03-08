import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-resumen-arriendo-dialog',
  templateUrl: './resumen-arriendo-dialog.component.html',
  styleUrls: ['./resumen-arriendo-dialog.component.css']
})
export class ResumenArriendoDialogComponent implements OnInit {
  

  resumenArriendoForm!: FormGroup;
  displayedColumns: string[] = [
    'fecha',
    'inicio',
    'termino',
    'total'
  ];


  estados: EstadoArriendos[] = [
    { value: 'en-terreno-1', viewValue: 'Efectivo' },
    { value: 'sin-retorno-2', viewValue: 'Débito' },
    { value: 'adeudado-3', viewValue: 'Crédito' },
    { value: 'finalizada-4', viewValue: 'Cheque' },
  ];
  selectedValue!: string;

  constructor(private formResumenArriendo: FormBuilder,public dialog: MatDialog) { }

  ngOnInit(): void {


    //this.generatePdf();

    this.resumenArriendoForm = this.formResumenArriendo.group({

      
      /*TABLA DETALLE MAQUINA*/
      
      txtFechaDetArr: [''],
     /* txtFechaDetArr: new FormControl(
      'txtOperarioDetMaqOt',
      Validators.required
    ), */
      txtInicioDetArr: [''],
      txtTerminoDetArr: [''],

  
      /* DATOS DE TABLA */
      

      /* UBICACION */
      

    });
  }


  setResumenArriendo() {
    this.closeDialog();

  }

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
    console.log('close dialog');

  }
}

interface EstadoArriendos {
  value: string;
  viewValue: string;
}