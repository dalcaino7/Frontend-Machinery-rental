import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from "@angular/router";


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { OrdenTrabajoComponent } from './orden-trabajos/components/orden-trabajo/orden-trabajo.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { MatExpansionModule } from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { ArriendoComponent } from './orden-trabajos/components/orden-trabajo/arriendo/main-arriendo.component';
import { CreacionArriendoComponent } from './orden-trabajos/components/orden-trabajo/arriendo/creacion-arriendo/creacion-arriendo.component';
import { MatStepperModule } from '@angular/material/stepper';
import {GoogleMapsModule} from '@angular/google-maps'; 
import { LocationService } from './services/location.service';
import { DetalleMaquinariaDialogComponent } from './orden-trabajos/components/orden-trabajo/arriendo/creacion-arriendo/detalle-maquinaria/detalle-maquinaria-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DetalleArriendoComponent } from './orden-trabajos/components/orden-trabajo/arriendo/detalle-arriendo/detalle-arriendo.component';
import { IngresoDetalleArriendoDialogComponent } from './orden-trabajos/components/orden-trabajo/arriendo/detalle-arriendo/ingreso-detalle-arriendo/ingreso-detalle-arriendo-dialog.component';
import { ResumenArriendoDialogComponent } from './orden-trabajos/components/orden-trabajo/arriendo/creacion-arriendo/resumen-arriendo/resumen-arriendo-dialog.component';
import { ClienteComponent } from './clientes/components/main-cliente/main-cliente.component';
import { MainMaquinaComponent } from './maquinas/components/main-maquina/main-maquina.component';
import { CreacionMaquinaDialogComponent } from './maquinas/components/creacion-maquina/creacion-maquina-dialog.component';
import { VerMaquinaDialogComponent } from './maquinas/components/main-maquina/ver-maquina/ver-maquina-dialog.component';
import { VerClienteDialogComponent } from './clientes/components/main-cliente/ver-cliente/ver-cliente-dialog.component';
import { CreacionClienteDialogComponent } from './clientes/components/creacion-cliente/creacion-cliente-dialog.component';
import { SearchFilterTablePipe } from './pipes/search-filter-table.pipe';
import { FormatoNumeroMonedaPipe } from './pipes/FormatoNumeroMoneda.pipe';

export const MY_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    OrdenTrabajoComponent,
    DashboardComponent,
    NavigationComponent,
    PagenotfoundComponent,
    ArriendoComponent,
    CreacionArriendoComponent,
    DetalleMaquinariaDialogComponent,
    DetalleArriendoComponent,
    IngresoDetalleArriendoDialogComponent,
    ResumenArriendoDialogComponent,
    ClienteComponent,
    MainMaquinaComponent,
    CreacionMaquinaDialogComponent,
    VerMaquinaDialogComponent,
    VerClienteDialogComponent,
    CreacionClienteDialogComponent,
    SearchFilterTablePipe,
    FormatoNumeroMonedaPipe,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    LayoutModule,
    MatToolbarModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatStepperModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatSelectModule,
    MatSortModule,
    GoogleMapsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule
   // MatTableDataSource
  ],
  providers:[
    LocationService,
    { 
      provide: MAT_DATE_LOCALE, 
      useValue: 'es'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter    
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

 
  bootstrap: [AppComponent],
})
export class AppModule { }
