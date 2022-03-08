import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/clientes/models/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente-dialog.component.html',
  styleUrls: ['./ver-cliente-dialog.component.css']
})
export class VerClienteDialogComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  constructor(
    public dialog: MatDialog, 
    private cliServ: ClienteService, 
    private actRou: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public idCli: DialogData
    ) { }

  ngOnInit(): void {
    this.showCliente();

  }


  showCliente(){    
    this.actRou.params.subscribe( params => {
      if(this.idCli.idClienteDialog){       
        this.cliServ.getCliente(this.idCli.idClienteDialog).subscribe(
          (cli) => this.cliente = cli)
      }
    })
    }
    

  closeDialog(){
    this.dialog.closeAll();
  }

  
}

export interface DialogData {
  idClienteDialog: string;
}


