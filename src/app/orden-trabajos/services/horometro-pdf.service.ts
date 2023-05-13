import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HorometroRequest } from '../models/horometro-request';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HorometroResponse } from '../models/horometro-response';

@Injectable({
  providedIn: 'root'
})
export class HorometroPDFService {

  private urlEndPoint: string = 'http://localhost:8080/api/generarPDF/planilla-horas';
  

  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  createHorometroPDF(hr: HorometroRequest): Observable<HorometroResponse> {
    console.log("entro a service horometro HR: ",hr);

    return this.http
      .post<HorometroResponse>(this.urlEndPoint, hr, {
        headers: this.http_Headers,
        
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al generar documento', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

}
