import { analyzeFile } from '@angular/compiler';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { Region } from 'src/app/models/region';
import { Comuna } from 'src/app/models/comuna';
import { RegionComunaChileService } from '../../../services/region-comuna-chile.service';

import Swal from 'sweetalert2';
import * as _ from 'lodash'; //paquete para el manejo de matrices
import { ComunasRegiones } from '../../../models/comunasRegiones';


@Component({
  selector: 'app-creacion-cliente',
  templateUrl: './creacion-cliente-dialog.component.html',
  styleUrls: ['./creacion-cliente-dialog.component.css'],
})

export class CreacionClienteDialogComponent implements OnInit {
  strIntoObj: Region[] = [];

  // selectedValueRegion: string = ''; //guarda el nombre de la region
  // selectedValueComuna: string = ''; // guarda el nombre de la comuna
  // estadoSelectorComuna: boolean = true; // Para des/habilitar selector Comuna
  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];

  dataSource = new MatTableDataSource<Cliente>();
  public cli: Cliente = new Cliente();
  //public clienteActual: Cliente = new Cliente();
  
  clienteForm!: FormGroup;

  titulo: string = '';
  nombreMaquina: string = '';
  nombreBoton: string = '';
  selectedValue: string = '';

  paises: selectData[] = [
    { value: 'chile', viewValue: 'Chile' },
    { value: 'argentina', viewValue: 'Argentina' },
    { value: 'peru', viewValue: 'Perú' },
    { value: 'brasil', viewValue: 'Brasil' },
    { value: 'eeuu', viewValue: 'Estados Unidos' },
  ];


  apiResponse: any = []; //contiene la lista de clientes de la tabla

  constructor(
   
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public stateMainCliente: DialogData,
    @Inject(MAT_DIALOG_DATA) public idCli: DialogData,
    private cliService: ClienteService,
    private rou: Router,
    private rgnService: RegionComunaChileService
    
  ) {}

  ngOnInit(): void {

    this.validateShowDataDialog();
//console.log("1 cli.cli_Region: ",this.cli.cli_Region);

    if(this.stateMainCliente.modeDialog == 'mod'){//si es mod entra a consultar comuna para mostrar
      /* MUESTRA TABLA FILTRADA */
       this.rgnService.getListRegiones().subscribe((rgn: ComunasRegiones) => {
      //  this.regionSelect = rgn.rcsDescripcion;
        console.log("1-> lleno el selector (this.regionSelect): ",this.regionSelect);

          for (let rg of this.regionSelect) {
            console.log("2-> recorre selector: ",rg ,"y encuentra con cli.cli_Region: ",this.cli.cli_Region);

             if (rg.nombre === this.cli.cli_Region) {
              this.listComuna(rg.codigo);
              console.log("2-> recorre selector: ",rg ,"y encuentra con cli.cli_Region: ",this.cli.cli_Region);

            } 
          } 
      });

    }else{

        this.listRegiones();
        console.log("3 cli.cli_Region: ",this.cli.cli_Region);

    }

    /* DECLARACION DE FORMULARIO DE CLIENTE */
    this.clienteForm = this.formBuilder.group({
      /* VARIABLES BASICAS DE CLIENTE */
      txtRutCli: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(12), Validators.pattern("^[0-9]+-[0-9kK]{1}$")]], // Pattern para RUT formato(1-9 o 12345678-9)
      txtRazonSocialCli: [],
      txtNombreCli: ['',[Validators.required, Validators.minLength(2)]],
      txtApellidosCli: ['',[Validators.required, Validators.minLength(2)]],
      txtObservacionCli: [''],

      /* VARIABLES DE CONTACTO DE CLIENTE */
      txtResponsable: [''],
      txtTelefonoCli: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]], //pattern SOLO NUMEROS
      txtEmailCli: ['', Validators.email],
      selPaisCli: ['',Validators.required],
      selRegionCli:['',Validators.required],
      selComunaCli: ['',Validators.required],
      txtDireccionCli:['',[Validators.required,Validators.minLength(3)]],
    });
  }

  listRegiones() {
    this.rgnService.getListRegiones().subscribe((rgn: ComunasRegiones) => {
      this.strIntoObj = JSON.parse(rgn.rcsDescripcion);
      this.regionSelect = this.strIntoObj;
    }); 
  }

  regionFilter($event: any) {
      for (let rg of this.regionSelect) {
        if (rg.nombre === $event.value) {
          this.listComuna(rg.codigo);
        }
      }
  }

 
  listComuna(cod: string) {
    this.rgnService.getListComunas(cod).subscribe((cmn: ComunasRegiones) => {
      this.strIntoObj = JSON.parse(cmn.rcsDescripcion);
      this.comunaSelect = this.strIntoObj;
    });
  }



  validateShowDataDialog() {
    if (this.stateMainCliente.modeDialog == 'add') {
      this.titulo = 'Nuevo Cliente';
      this.nombreMaquina = '';
      this.nombreBoton = 'Guardar';
    }
    if (this.stateMainCliente.modeDialog == 'mod') {
      this.titulo = 'Modificación de Cliente';
      this.nombreMaquina = '';
      this.nombreBoton = 'Actualizar';
      this.showCliente();

    }
  }

  showCliente() {
   // this.actRou.params.subscribe((params) => {
      if (this.idCli.idClienteDialog) {
        this.cliService.getCliente(this.idCli.idClienteDialog)
          .subscribe((clie) => {    
            console.log("1.4 cli.cli_Region: ",this.cli.cli_Region);

            (this.cli = clie)
            console.log("1.5 cli.cli_Region: ",this.cli.cli_Region);


          });
      }
      
   // });
  }

  validaOperacion() {
    if (this.stateMainCliente.modeDialog == 'add') {
      this.procesarInsert();
    }
    if (this.stateMainCliente.modeDialog == 'mod') {
      this.procesarUpdate();
    }
  }

  procesarInsert() {
    this.cli.cli_Rut = this.clienteForm.value['txtRutCli'];
    this.cli.cli_RazonSocial = this.clienteForm.value['txtRazonSocialCli'];
    this.cli.cli_Nombre = this.clienteForm.value['txtNombreCli'];
    this.cli.cli_Apellidos = this.clienteForm.value['txtApellidosCli'];
    this.cli.cli_Observacion = this.clienteForm.value['txtObservacionCli'];
    
    this.cli.cli_Responsable = this.clienteForm.value['txtResponsable'];

    this.cli.cli_Telefono = this.clienteForm.value['txtTelefonoCli'];
    this.cli.cli_Email = this.clienteForm.value['txtEmailCli'];
    this.cli.cli_Pais = this.clienteForm.value['selPaisCli'];
    this.cli.cli_Region = this.clienteForm.value['selRegionCli'];
    this.cli.cli_Comuna = this.clienteForm.value['selComunaCli'];
    this.cli.cli_Direccion = this.clienteForm.value['txtDireccionCli'];
    this.cli.cli_Foto = 'sin_foto';
    this.cli.cli_Estado = 'activo';
    this.cli.cli_Estado_Arriendo = 'Sin Registro';
    this.cli.cli_Estado_Maquinaria = 'Sin Registro';
    this.cli.cli_Estado_Pago = 'Sin Registro';

    this.cliService.createCliente(this.cli).subscribe((resp) => {
      //this.rou.navigate(['main-cliente']);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `El cliente ha sido creado con éxito`,
        showConfirmButton: false,
        timer: 2300,
      });
      setInterval(function () {
        location.reload();
      }, 2000); //actualiza la pagina a los 2seg
      this.closeDialog();
    });
  }

  procesarUpdate() {
    this.cliService.updateCliente(this.cli).subscribe((resp) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Registros actualizados exitosamente`,
        showConfirmButton: false,
        timer: 2300,
      });
      setInterval(function () {
        location.reload();
      }, 2000); //actualiza la pagina a los 2seg
      this.closeDialog();
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  /* METODO QUE VALIDA TODOS LOS CAMPOS DEL FORMULARIO */
  validaciones(campo: string){
    return this.clienteForm.controls[campo].errors && // AL HABER ERRORES DESCRITOS EN LA DEFINICION DEL CONTROLFORM
    this.clienteForm.controls[campo].touched; // AL SER TOCADO EL CAMPO
  }
}

interface selectData {
  value: string;
  viewValue: string;
}

export interface DialogData {
  modeDialog: string;
  idClienteDialog: string;
}
