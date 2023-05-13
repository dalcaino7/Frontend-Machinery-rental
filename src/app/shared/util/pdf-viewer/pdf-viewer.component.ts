import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as PDFObject from 'pdfobject';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit{
   base64: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

  ngOnInit() {
    this.base64 = "data:application/pdf;base64,"+this.data.docHoromet;
    PDFObject.embed(this.base64 , '#pdfContainer');
  }

}

export interface DialogData {
  docHoromet: string;
}
