import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { TipoCobroMaquina } from '../models/tipo-cobro-maquina';

@Injectable({
  providedIn: 'root'
})
export class TipoCobroMaquinaService {

  private urlEndPoint: string = 'https://giant-guide-production.up.railway.app/api/tipoCobroMaquina/';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }


  getListTipoCobroMaquina(): Observable<TipoCobroMaquina[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as TipoCobroMaquina[]));
  }

  getTipoCobroMaquina(id: number): Observable<TipoCobroMaquina> {
    return this.http.get<TipoCobroMaquina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener TipoMaquina', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createTipoCobroMaquina(tMaq: TipoCobroMaquina): Observable<TipoCobroMaquina> {
    return this.http
      .post<TipoCobroMaquina>(this.urlEndPoint, tMaq, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al crear TipoMaquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateTipoCobroMaquina(tMaq: TipoCobroMaquina): Observable<TipoCobroMaquina> {
    return this.http
      .put<TipoCobroMaquina>(`${this.urlEndPoint}/${tMaq.tcm_Id}`, tMaq, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al actualizar TipoMaquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }


}
