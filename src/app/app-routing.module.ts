import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdenTrabajoComponent } from './orden-trabajos/components/orden-trabajo/orden-trabajo.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CreacionArriendoComponent } from './orden-trabajos/components/orden-trabajo/arriendo/creacion-arriendo/creacion-arriendo.component';
import { DetalleArriendoComponent } from './orden-trabajos/components/orden-trabajo/arriendo/detalle-arriendo/detalle-arriendo.component';

import { MainMaquinaComponent } from './maquinas/components/main-maquina/main-maquina.component';
import { VerMaquinaDialogComponent } from './maquinas/components/main-maquina/ver-maquina/ver-maquina-dialog.component';
import { CreacionMaquinaDialogComponent } from './maquinas/components/creacion-maquina/creacion-maquina-dialog.component';

import { ClienteComponent } from './clientes/components/main-cliente/main-cliente.component';
import { VerClienteDialogComponent } from './clientes/components/main-cliente/ver-cliente/ver-cliente-dialog.component';
import { CreacionClienteDialogComponent } from './clientes/components/creacion-cliente/creacion-cliente-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },

  { path: 'ordentrabajo', component: OrdenTrabajoComponent },
  { path: 'nuevoarriendo', component: CreacionArriendoComponent},
  { path: 'detallearriendo', component: DetalleArriendoComponent},

  { path: 'main-maquina', component: MainMaquinaComponent},
  { path: 'ver-maquina', component: VerMaquinaDialogComponent},
  { path: 'creacion-maquina', component: CreacionMaquinaDialogComponent},

  { path: 'main-cliente', component: ClienteComponent},
  { path: 'ver-cliente', component: VerClienteDialogComponent},
  { path: 'ver-cliente/:id', component: VerClienteDialogComponent},
  { path: 'creacion-cliente', component: CreacionClienteDialogComponent},

  { path: '**', component: PagenotfoundComponent } //RUTA COMODIN CUANDO SE INTENTA INGRESAR A UNA PAGINA INEXISTENTE
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }