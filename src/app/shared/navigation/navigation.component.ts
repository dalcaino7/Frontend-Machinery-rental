import { Component, OnInit } from '@angular/core';
//import { ObservableMedia, MediaChange } from '@angular/flex-layout';
//import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription } from 'rxjs';


import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent{
 // opened = true;
  //over = 'side';
  //expandHeight = '42px';
  //collapseHeight = '42px';
  //displayMode = 'flat';


  //watcher: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

constructor(private breakpointObserver: BreakpointObserver) {}



  //constructor(//media: MediaObserver
   // ) {
    /*this.watcher = media.asObservable().subscribe((change: MediaChange[]) => {
      
      const currentMediaChange = change[0];

      if (currentMediaChange.mqAlias === 'sm' || currentMediaChange.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
    });*/
  }




/*
  constructor( media: MediaObserver) {
    this.watcher = media.asObservable().subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
      
     
    });
  }

  */
/*

  @ViewChild('sidenav') sidenav!: MatSidenavModule;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
*/
  //ngOnInit() {

  //}


