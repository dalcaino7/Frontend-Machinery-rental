import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Maquina } from '../models/maquina';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { EstadoMaquina } from '../models/estado-maquina';

@Injectable({
  providedIn: 'root'
})
export class EstadoMaquinaService {
  private urlEndPoint: string = 'http://localhost:8080/api/estadoMaquina/';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  getListEstadoMaquinas(): Observable<EstadoMaquina[]> {
    return this.http.get(this.urlEndPoint).pipe(map(
      response => response as EstadoMaquina[])
    );
  }

  getEstadoMaquina(id: number): Observable<EstadoMaquina> {
    return this.http.get<EstadoMaquina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener EstadoMaquina', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createEstadoMaquina(EMaq: EstadoMaquina): Observable<EstadoMaquina> {
    return this.http
      .post<EstadoMaquina>(this.urlEndPoint, EMaq, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al crear EstadoMaquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateEstadoMaquina(EMaq: EstadoMaquina): Observable<EstadoMaquina> {
    return this.http
      .put<EstadoMaquina>(`${this.urlEndPoint}/${EMaq.ema_Id}`, EMaq, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al actualizar EstadoMaquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }



}
