import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LocationService } from '../../../../../services/location.service';
import { AnyObject } from 'chart.js/types/basic';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DetalleMaquinariaDialogComponent } from './detalle-maquinaria/detalle-maquinaria-dialog.component';
import { ResumenArriendoDialogComponent } from './resumen-arriendo/resumen-arriendo-dialog.component';
import { CreacionClienteDialogComponent } from '../../../../../clientes/components/creacion-cliente/creacion-cliente-dialog.component';
import { CreacionMaquinaDialogComponent } from '../../../../../maquinas/components/creacion-maquina/creacion-maquina-dialog.component';
import { ClienteService } from '../../../../../clientes/services/cliente.service';
import { Cliente } from 'src/app/clientes/models/cliente';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Maquina } from '../../../../../maquinas/models/maquina';
import { MaquinaService } from '../../../../../maquinas/services/maquina.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { data } from 'jquery';
import { RegionComunaChileService } from 'src/app/services/region-comuna-chile.service';
import { Region } from 'src/app/models/region';
import { Comuna } from 'src/app/models/comuna';
import { ComunasRegiones } from '../../../../../models/comunasRegiones';
import { OrdenTrabajo } from '../../../../models/orden-trabajo';
import { OtDetalleMaquina } from '../../../../models/ot-detalle-maquina';
import { OrdenTrabajoService } from '../../../../services/orden-trabajo.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { forEach } from 'lodash';
import { DetalleArriendoComponent } from '../detalle-arriendo/detalle-arriendo.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-arriendo',
  templateUrl: './creacion-arriendo.component.html',
  styleUrls: ['./creacion-arriendo.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CreacionArriendoComponent implements OnInit {
  ot:OrdenTrabajo = new OrdenTrabajo;
  //detOt:OtDetalleMaquina = new OtDetalleMaquina;

  detOtList: Array<OtDetalleMaquina> = [];

  validaLStorage: boolean[] = [];
  strIntoObj: Region[] = [];

  txtBusquedaCliente = new FormControl();
  txtBusquedaMaquina = new FormControl();


  public cli: Cliente = new Cliente();

  otForm!: FormGroup;

  formUbicacion!: FormGroup;

  public toggle_mostrarMapa = false;

  // Configuración de Google Maps
  map = null;
  center: any;
  zoom: any;
  display?: google.maps.LatLngLiteral;
  marker: any;

  clientes: Cliente[] = [];
  maquinas: Maquina[] = [];

  // Configuración de combobox de direcciones
  selectedValueRegion: string = '';
  selectedValueComuna: string = '';
  /*   email = new FormControl('', [Validators.required, Validators.email]);
   */

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  tercerFormGroup!: FormGroup;

  dataSourceCliente = new MatTableDataSource<Cliente>(this.clientes);
  dataSourceMaquinaria = new MatTableDataSource<Maquina>(this.maquinas);

  filteredClienteList!: Observable<string[]>;
  filteredMaquinaList!: Observable<string[]>;

  listClientesListInput: any = [];
  listMaquinasListInput: any = [];


  displayedColumnsCliente: string[] = [
    'rut',
    'razonSocial',
    'nombre',
    'comuna',
    'deleteAction',
  ];

  displayedColumnsMaquinaria: string[] = [
    'codigo',
    'nombre',
    'valorMinimo',
    'precio',
    'tipoCobro',
    'acciones',
  ];

  regionSelect: any[] = []; //Muestra la lista del select en el template
  comunaSelect: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    public locationService: LocationService,
    public dialog: MatDialog,
    private rgnService: RegionComunaChileService,
    private cliService: ClienteService,
    private maqService: MaquinaService,
    private otService: OrdenTrabajoService
  ) {
    this.formUbicacion = formBuilder.group({
      select_region: '',
      select_comuna: '',
      input_direccion: '',
      toggle_localizacion: ['', Validators.requiredTrue],
    });
  }

  ngOnInit() {

    localStorage.clear();
    /*  FUNCIONALIDAD CLIENTE */
    this.listCliente();

    /*  FUNCIONALIDAD MAQUINARIA */
    this.listMaquina();

    /* DECLARACION DE FORMULARIO DE OT */
    this.otForm = this.formBuilder.group({
      /* VARIABLES DE ORDEN DE TRABAJO */
      txtNumeroOt: ['',[Validators.required, Validators.maxLength(20)]],
      txtReferenciaOt: ['',Validators.maxLength(20)],
      txtFechaOt: ['',Validators.required],

      /* VARIABLES DE CLIENTE */
      txtRutClienteOt: [''],
      txtNombreClienteOt: [''],
      txtNombreContactoClienteOt: [''],
      txtTelefonoContactoClienteOt: [''],
      txtEmailContactoClienteOt: [''],
      txtRegionContactoClienteOt: ['',Validators.required],
      txtComunaContactoClienteOt: ['',Validators.required],
      txtDireccionContactoClienteOt: ['',[Validators.required, Validators.maxLength(60)]],

      /* VARIABLES DE MAQUINARIA */
      txtCodigoMaquinaOt: [''],
      txtNombreMaquinaOt: [''],
    });

    // this.firstFormGroup = this.formBuilder.group({
    //   firstCtrl: ['', Validators.required],
    // });
    // this.secondFormGroup = this.formBuilder.group({
    //   secondCtrl: ['', Validators.required],
    // });
    // this.tercerFormGroup = this.formBuilder.group({
    //   tercerCtrl: ['', Validators.required],
    // });
    this.listRegiones();
  } // fin Init

  listCliente(){
    this.cliService.getListClientes().subscribe((cli) => {
      this.listClientesListInput = cli;
    
      for (let i = 0; i < cli.length; i++) {
        if (!cli[i].cli_RazonSocial || cli[i].cli_RazonSocial === null) {
          this.listClientesListInput[i] =
            cli[i].cli_Rut +
            '  '+' | ' +'  '+
            cli[i].cli_Nombre +
            ' ' +
            cli[i].cli_Apellidos;
        } else {
          this.listClientesListInput[i] =
            cli[i].cli_Rut +
            '  '+' | ' +'  '+
            cli[i].cli_RazonSocial +
            '  '+' | ' +'  '+
            cli[i].cli_Nombre +
            ' ' +
            cli[i].cli_Apellidos; 
        }
      }
    });

    this.filteredClienteList = this.txtBusquedaCliente.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCliente(value) //va al metodo filter
    ));

  }

  listMaquina(){
    this.maqService.getListMaquinas().subscribe((maq) => {
      this.listMaquinasListInput = maq;
    
      for (let i = 0; i < maq.length; i++) {
          this.listMaquinasListInput[i] = 
            maq[i].maq_Codigo +
            '  '+' | ' +'  '+
            maq[i].maq_Nombre +
            '  '+' | ' +'  '+
            maq[i].maq_Marca;

      }
    });

    this.filteredMaquinaList = this.txtBusquedaMaquina.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMaquina(value) //va al metodo filter
    ));

  }

  /* metodo que entra en el init */
  private _filterCliente(value: string): string[] {
    const filterValueCli = value.toLowerCase();
    return this.listClientesListInput.filter((option: string) =>
      option.toLowerCase().includes(filterValueCli)
    );
  }

  private _filterMaquina(value: string): string[] {
    const filterValueMaq = value.toLowerCase();
    return this.listMaquinasListInput.filter((option: string) =>
      option.toLowerCase().includes(filterValueMaq)
    );
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

  showCliente(dataCliente: any){
    //console.log("HII");
    
    this.txtBusquedaCliente.setValue('');
    let cliSearch = dataCliente.substring(0,12).replace('|',' ').trim();
    this.cliService.getListClientes().subscribe((cli) => {
    for (let i = 0; i < cli.length; i++) {
      if(cli[i].cli_Rut == cliSearch){
        this.dataSourceCliente.filter = cli[i].cli_Rut
        this.dataSourceCliente.data = cli
      }
    }
    });
  }

  showMaquina(dataMaquina: any){
    
    this.txtBusquedaMaquina.setValue('');
    let maqSearch = dataMaquina.substring(0,dataMaquina.indexOf('|')).trim();//.lastIndexOf('|')//.substring(0,12).replace('|',' ').trim();
         
    if(this.dataSourceMaquinaria.data.length == 0){ // validamos el largo de la tabla 
      this.insertDataSourceMaquina(maqSearch);
    }else{
      var valInsert: any=[];
      for (let x = 0; x < this.dataSourceMaquinaria.data.length; x++) {
        if(maqSearch === this.dataSourceMaquinaria.data[x].maq_Codigo){
          valInsert[x] = false;
        }else{
          valInsert[x] = true;
        }
      }

      if(!valInsert.includes(false)){
        this.insertDataSourceMaquina(maqSearch);
      }

    }

  }

  insertDataSourceMaquina(maqSearch: any){
    

    this.maqService.getListMaquinas().subscribe((maq) => {
      console.log("======================================================================== ");
      console.log("******************* inicio INSERT ********************** ");

      console.log("maq.length: ",maq.length);

      for (let i = 0; i < maq.length; i++) {
        console.log("i: ",i);

        console.log("maq[i].maq_Codigo: ",maq[i].maq_Codigo);
        console.log("maqSearch: ",maqSearch);
        if(maq[i].maq_Codigo === maqSearch){
          console.log("Entro a if donde->  maq[i].maq_Codigo === maqSearch");

          let x = this.dataSourceMaquinaria.data.length;
          console.log("this.dataSourceMaquinaria.data.length: ", x);

          


          console.log("this.validaLStorage[i]: ",this.validaLStorage[x]);

          this.validaLStorage[x] = false;
          console.log("this.validaLStorage[i]: ",this.validaLStorage[x]);

         
          console.log("this.validaLStorage: ",this.validaLStorage);

         
          this.dataSourceMaquinaria.data.push(maq[i]);
          this.dataSourceMaquinaria.data = this.dataSourceMaquinaria.data.slice();  
        }
      }
      console.log("******************* FIN INSERT ********************** ");
      console.log("======================================================================== ");

    });

    

    
  }
  

  onFormSubmit() {
    alert(JSON.stringify(this.formUbicacion.value, null, 2));
  }

  deleteCliente() {
    this.dataSourceCliente.data = [];
  }

  deleteMaquina(x: any) {
    console.log("==================================================================");

    console.log("****  INICIO DELETE MAQ  ****");
    console.log("x: ",x);

    console.log("this.dataSourceMaquinaria.data[x].maq_Codigo: ",this.dataSourceMaquinaria.data[x].maq_Codigo);
    this.validaLStorage[x] = false;
    this.validaLStorage.splice(x,1);
    console.log("this.validaLStorage: ",this.validaLStorage);

    localStorage.removeItem(this.dataSourceMaquinaria.data[x].maq_Codigo);
    this.dataSourceMaquinaria.data.splice(x, 1);
    this.dataSourceMaquinaria._updateChangeSubscription(); // <-- Refresh the datasource 

    
    
    console.log("****   FIN DELETE MAQ    ****");
    console.log("==================================================================");


  }
 /*  mostrarMapa() {
    if (this.toggle_mostrarMapa) {
      let location = this.getLocation();
      this.toggle_mostrarMapa = true;
    }
  }

  getLocation() {
    this.locationService.getPosition().then((pos) => {
      // Configuración de Google Maps
      this.center = { lat: pos.lat, lng: pos.lng }; //pos-lat y pos.lng obtiene la latitud y longitud del mapa
      this.zoom = 16;
      this.marker = {
        position: { lat: pos.lat, lng: pos.lng },
      };
    });
  }
 */
  addCliente() {
    const dialogRef = this.dialog.open(CreacionClienteDialogComponent, {
      panelClass: 'custom-dialog-container-big-2',
      data: { modeDialog: 'add' },
    });
  }

  addMaquina() {
    const dialogRef = this.dialog.open(CreacionMaquinaDialogComponent, {
      panelClass: 'custom-dialog-container-big-3',
      data: { modeDialog: 'add' },
    });
  }

  procesarOt() {
    console.log("0 this.ot.otr_Odm_Id: ",this.ot.otr_Odm_Id);

    this.addLocalStorage();
    // confirm('Está seguro de finalizar?');
    this.openDialog('resumen',null);
  }
  
 

  addLocalStorage(){

    this.ot.otr_Id = "0";
    this.ot.otr_NumeroOrden = this.otForm.value.txtNumeroOt;
    console.log("this.ot.otr_NumeroOrden: ",this.ot.otr_NumeroOrden);

    this.ot.otr_Referencia =this.otForm.value.txtReferenciaOt;
    this.ot.otr_Tipo = "Arriendo";
    this.ot.otr_FechaHoraCreacionOt=this.otForm.value.txtFechaOt;
    //this.ot.otr_FechaHoraTerminoOt='';
    this.ot.otr_Estado = "Iniciada";
    this.ot.otr_Impuesto = "0";
    this.ot.otr_PrecioTotal = "0";
    this.ot.otr_EstadoPago = "Pendiente";
    //this.ot.otr_FormaPago = null;
    
    this.ot.otr_NombreContacto =this.otForm.value.txtNombreContactoClienteOt;
    this.ot.otr_TelefonoContacto=this.otForm.value.txtTelefonoContactoClienteOt;
    this.ot.otr_EmailContacto = this.otForm.value.txtEmailContactoClienteOt;
    this.ot.otr_RegionTrabajo = this.otForm.value['txtRegionContactoClienteOt'];
    this.ot.otr_ComunaTrabajo = this.otForm.value['txtComunaContactoClienteOt'];
    this.ot.otr_DireccionTrabajo = this.otForm.value.txtDireccionContactoClienteOt;

    this.ot.otr_Observacion = "Observacion por defecto";
    
    this.ot.otr_Cli_Id.cli_Id = this.dataSourceCliente.filteredData[0].cli_Id;
    this.ot.otr_Cli_Id.cli_Nombre = this.dataSourceCliente.filteredData[0].cli_Nombre;
    this.ot.otr_Cli_Id.cli_Apellidos = this.dataSourceCliente.filteredData[0].cli_Apellidos;
    this.ot.otr_Cli_Id.cli_RazonSocial = this.dataSourceCliente.filteredData[0].cli_RazonSocial;
    this.ot.otr_Cli_Id.cli_Rut = this.dataSourceCliente.filteredData[0].cli_Rut;
    this.ot.otr_Usu_Id.usu_Id = "1";

    for (let x=0; x < this.dataSourceMaquinaria.data.length; x++) {
  
      let jsonDetMaqOt = JSON.parse(localStorage.getItem(this.dataSourceMaquinaria.data[x].maq_Codigo) || '[]');
      let maquina = new Maquina();
      //maquina.maq_Id = this.dataSourceMaquinaria.data[x].maq_Id;
      maquina.maq_Id = jsonDetMaqOt.idMaquina;
      maquina.maq_Codigo = jsonDetMaqOt.codigoMaquina;
      maquina.maq_Nombre = jsonDetMaqOt.nombreMaquina;
          
      if(jsonDetMaqOt.traslado=='true'){
        jsonDetMaqOt.traslado = 'Si';
      }else{
        jsonDetMaqOt.traslado = 'No';
      }

      if(jsonDetMaqOt.cilindroGas=='true'){
        jsonDetMaqOt.cilindroGas = 'Si';
      }else{
        jsonDetMaqOt.cilindroGas = 'No';
      }

      this.ot.otr_Odm_Id.push({
        odm_Id: "0",
        odm_NombreOperario:jsonDetMaqOt.operario,
        odm_ValorMinArriendo:jsonDetMaqOt.valorMinimo,
        odm_TipoValorMinArriendo:this.dataSourceMaquinaria.data[x].maq_TipoValorMinArriendo,
        odm_ValorArriendo: jsonDetMaqOt.precio,
        odm_NivelEstanqueSalida:jsonDetMaqOt.combustible,
        otr_Traslado: jsonDetMaqOt.traslado,
        odm_CilindroGas:jsonDetMaqOt.cilindroGas,
        odm_NombreContacto:jsonDetMaqOt.nombreContacto,
        odm_TelefonoContacto:jsonDetMaqOt.telefonoContacto,
        odm_EmailContacto: jsonDetMaqOt.emailContacto,
        odm_RegionTrabajo: jsonDetMaqOt.region,
        odm_ComunaTrabajo: jsonDetMaqOt.comuna,
        odm_DireccionTrabajo:jsonDetMaqOt.direccion,
        odm_FechaHoraInicio: "",
        odm_ControlInicio: "0",
        odm_FechaHoraTermino: "",
        odm_ControlTermino:"0",
        odm_NombreUsuario: "System",
        odm_Observacion: jsonDetMaqOt.observacion,
        odm_Maq_Id: maquina
      });
      
    }
   
    console.log("this.ot: ",this.ot);
    localStorage.setItem(this.ot.otr_NumeroOrden, JSON.stringify(this.ot));
   




/**  SEGUIR COMPLETANDO **/
    


    
    // this.otService.createOt(this.ot).subscribe((ot)=>{

    // console.log("OT: ",ot);
    
    // });


  }

  insertarOt(){
    console.log("OT PREVIO",this.ot);

    this.ot.otr_Cli_Id.cli_Id = this.dataSourceCliente.filteredData[0].cli_Id;
    this.ot.otr_Cli_Id.cli_Nombre = this.dataSourceCliente.filteredData[0].cli_Nombre;
    this.ot.otr_Cli_Id.cli_Apellidos = this.dataSourceCliente.filteredData[0].cli_Apellidos;
    this.ot.otr_Cli_Id.cli_RazonSocial = this.dataSourceCliente.filteredData[0].cli_RazonSocial;
    this.ot.otr_Cli_Id.cli_Rut = this.dataSourceCliente.filteredData[0].cli_Rut;
    this.ot.otr_Cli_Id.cli_Comuna = '';

    this.otService.createOt(this.ot).subscribe((ot)=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `La Orden de Arriendo ha sido creada con éxito`,
        showConfirmButton: false,
        timer: 2300,
      });
      setInterval(function () {
        location.reload();
      }, 2000); //actualiza la pagina a los 2seg
    console.log("OT FINAL INSERTADO: ",ot);
    
    });
  }

  openDialog(definition: string, x: any) {
    console.log("open dialog: (definition): ", definition);
    console.log("open dialog: (x): ", x);

    if (definition == 'resumen') {

      const dialogRef = this.dialog.open(ResumenArriendoDialogComponent, {
        panelClass: 'custom-dialog-container-medium',
        data:{
          idOt: this.otForm.value.txtNumeroOt
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.insertarOt();
      });
    } else {        
        const dialogRef = this.dialog.open(DetalleMaquinariaDialogComponent, {
          panelClass: 'custom-dialog-container-medium',
          data: { 
            idMachine: this.dataSourceMaquinaria.data[x].maq_Id, 
            codeMachine: this.dataSourceMaquinaria.data[x].maq_Codigo }
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log("==================================================================");
          console.log("****   INICIO CIERRE DET MAQ    ****");


          let jsonData = JSON.parse(localStorage.getItem(this.dataSourceMaquinaria.data[x].maq_Codigo) || '[]');
          // for (let x = 0; x < this.dataSourceMaquinaria.data.length; x++) {
            // console.log("this.dataSourceMaquinaria.data.length: ",this.dataSourceMaquinaria.data.length);
          console.log("jsonData: ",jsonData);

          console.log("codLocStorage: ",jsonData.codigoMaquina);

            if (jsonData !== null) {
              if(jsonData.codigoMaquina === this.dataSourceMaquinaria.data[x].maq_Codigo){

              console.log("this.dataSourceMaquinaria.data[register].maq_Codigo: ",this.dataSourceMaquinaria.data[x].maq_Codigo);
              this.validaLStorage[x] = true;

            //  for (let j = 0; j < this.dataSourceMaquinaria.data.length; j++) {
                // if(jsonData.codigoMaquina === this.dataSourceMaquinaria.data[x].maq_Codigo){
                // }
                console.log("this.dataSourceMaquinaria.data[j].maq_Id: ",this.dataSourceMaquinaria.data[x].maq_Id);

                // if(jsonData.valorMinimo == null || jsonData.precio == null){
                //   // this.maqService.getListMaquinas().subscribe((maq) => {



                //     this.dataSourceMaquinaria.data[x].maq_ValorMinArriendo =  this.machineDetailForm.value.txtTelefonoContactoDetOt;
                //     this.dataSourceMaquinaria.data[x].maq_ValorArriendo    = 
                //   // });
                  
                // }else{
                  this.dataSourceMaquinaria.data[x].maq_ValorMinArriendo = jsonData.valorMinimo;
                  this.dataSourceMaquinaria.data[x].maq_ValorArriendo    = jsonData.precio;
                // }
               
            //  }


              console.log("this.dataSourceMaquinaria: ",this.dataSourceMaquinaria);

              }
          //     if(jsonData.codigoMaquina === this.dataSourceMaquinaria.data[register].maq_Codigo){
          //       console.log("SI esta el valor en el localstorage ");

          // //       this.validaLStorage[x] = false;
          // //     }else{
          // //       this.validaLStorage[x] = true;
          //     }
            }
          // }
          console.log("****   FIN CIERRE DET MAQ    ****");

          console.log("==================================================================");

        });
    }
  }


 

  addOtLocalStorage(){

    

  }

  busquedaClienteFilter(filterValue: string) {
   /*  let valorEncontrado: string = '';

    if (filterValue) {


      this.cliService.getListClientes().subscribe((cli: Cliente[]) => {
        console.log('CLI->', cli);

        console.log('INICIO');
        console.log('filterValue->', filterValue);

        for (let i = 0; i < cli.length; i++) {
          var rut = cli[i].cli_Rut;

          var nombre = cli[i].cli_Nombre
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

          var apellido = cli[i].cli_Apellidos
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

          var nombreCompleto = nombre.concat(' '.concat(apellido));

          console.log(
            'NO: cli[i].cli_Nombre == filterValue->',
            nombreCompleto,
            ' === ',
            filterValue
          );
          console.log('rut->', rut, ' === ', filterValue);

          if (nombreCompleto === filterValue) {
            this.dataSourceCliente.data = cli;
            console.log(
              ' this.dataSourceCliente.data->',
              this.dataSourceCliente.data
            );

            this.dataSourceCliente.filter = filterValue;
            console.log(
              'this.dataSourceCliente.filter->',
              this.dataSourceCliente.filter
            );

            console.log(
              'ENCONTRO! nombreCompleto == filterValue->',
              nombreCompleto,
              ' ===',
              filterValue
            );

            valorEncontrado = nombreCompleto;
          }
        }

        if (!valorEncontrado) {
          this.dataSourceCliente.data = [];
        }
      });
    } else {
      this.dataSourceCliente.data = [];
    } */
  }

  /* Se guarda el filtro ingresado por cada evento onKey */
  nombreRutFilter(filterValue: string) {
    /* se normaliza el valor a buscar quitando tildes y dejando en minuscula */
    //
  //console.log('nombreRutFilter');

    filterValue = filterValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    // this.dataSourceMaquinaria.filter = filterValue;

    /* MUESTRA LA LISTA DE OPERARIOS */
    /* filterValue = this.txtOperarioDetMaqOt.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    ); */
    /* this.maqService.getListMaquinas().subscribe( (m: any) =>




) */
  }

  // changeStateIconMaquinaList(e: any){

  //   console.log("padre | changeStateIconMaquinaList (e): ", e);
    
  //   this.validaLStorage = e;
  //   console.log("padre | changeStateIconMaquinaList (this.validaLStorage): ", this.validaLStorage);

  // }

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


export interface maquinariaTable {
  codigo: string;
  nombre: string;
  valorMinimo: string;
  precio: number;
  tipoCobro: string;
  acciones: string;
}

