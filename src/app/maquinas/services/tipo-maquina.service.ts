import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Maquina } from '../models/maquina';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { TipoMaquina } from '../models/tipo-maquina';
@Injectable({
  providedIn: 'root'
})
export class TipoMaquinaService {
  private urlEndPoint: string = 'http://localhost:8080/api/tipoMaquina';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getListTipoMaquinas(): Observable<TipoMaquina[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as TipoMaquina[]));
  }

  getTipoMaquina(id: number): Observable<TipoMaquina> {
    return this.http.get<TipoMaquina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener TipoMaquina', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createTipoMaquina(tMaq: TipoMaquina): Observable<TipoMaquina> {
    return this.http
      .post<TipoMaquina>(this.urlEndPoint, tMaq, {
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

  updateTipoMaquina(tMaq: TipoMaquina): Observable<TipoMaquina> {
    return this.http
      .put<TipoMaquina>(`${this.urlEndPoint}/${tMaq.tma_Id}`, tMaq, {
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
