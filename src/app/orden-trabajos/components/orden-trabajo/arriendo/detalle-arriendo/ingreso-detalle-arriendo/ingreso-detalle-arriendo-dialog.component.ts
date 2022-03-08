import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-ingreso-detalle-arriendo-dialog',
  templateUrl: './ingreso-detalle-arriendo-dialog.component.html',
  styleUrls: ['./ingreso-detalle-arriendo-dialog.component.css']
})
export class IngresoDetalleArriendoDialogComponent implements OnInit {
  DetalleArriendoForm!: FormGroup;
  dataSource: any;
  ELEMENT_DATA_DETMAQUINA: detMaquinariaTable[] = [
    {
      operario: 'Juan Perez',
      valor: '475,6',
      precio: '$6.000',
      implemento: 'Orquilla 01',
      combustible: '3/4',
      accion: '',
    },
  ];

/*   txtFechaDetArr = new FormControl();
 */
  constructor(private formDetalleMaqOt: FormBuilder,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = this.ELEMENT_DATA_DETMAQUINA;

    this.DetalleArriendoForm = this.formDetalleMaqOt.group({

      
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

  addValores(){

    alert("valores agregados");
  }

  setDetalleArriendo() {


    this.closeDialog();
  }

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
    console.log('close dialog');

    
  }

  displayedColumnsDetArriendo: string[] = [
    'fecha',
    'inicio',
    'termino',
    'total'
  ];

}

export interface detMaquinariaTable {
  operario: string;
  valor: string;
  precio: string;
  implemento: string;
  combustible: string;
  accion: string;
}