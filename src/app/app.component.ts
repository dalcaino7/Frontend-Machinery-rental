import { Component } from '@angular/core';
//import { SidenavService } from './services/sidenav.service';
//import { onMainContentChange } from './animations/animations';
// import * as $ from 'jquery';


@Component({
  selector: "app-root",
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'//,
 // animations: [ onMainContentChange ]


})
export class AppComponent {
  title = 'machinery-rental';
  
             
  //public onSideNavChange: boolean=true;

  constructor(){}
  

  /*constructor(private _sidenavService: SidenavService) {
    this._sidenavService.sideNavState$.subscribe( res => {
      console.log(res)
      this.onSideNavChange = res;
    })
  }
*/



}
