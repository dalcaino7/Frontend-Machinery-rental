import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Maquina } from 'src/app/maquinas/models/maquina';
import { MaquinaService } from 'src/app/maquinas/services/maquina.service';

@Component({
  selector: 'app-ver-maquina',
  templateUrl: './ver-maquina-dialog.component.html',
  styleUrls: ['./ver-maquina-dialog.component.css']
})
export class VerMaquinaDialogComponent implements OnInit {
  
  maquina: Maquina = new Maquina();

  //maquina!: Maquina;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public idMaq: DialogData,
    private maqServ: MaquinaService, 
    private actRou: ActivatedRoute) { }

  ngOnInit(): void {
    this.showCliente();
  }

  showCliente(){        
    //this.actRou.params.subscribe( () => {
      if(this.idMaq.idMaquinaDialog){    
        this.maqServ.getMaquina(this.idMaq.idMaquinaDialog).subscribe(
          (maq) => {            
            this.maquina = maq}
        )
      }
    //})
  }

  closeDialog(){
    this.dialog.closeAll();
  }

}

export interface DialogData {
  idMaquinaDialog: number;
}