import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Maquina } from '../models/maquina';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService {
  private urlEndPoint: string = 'http://localhost:8080/api/maquinas';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getListMaquinas(): Observable<Maquina[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Maquina[]));
  }

  getMaquina(id: string): Observable<Maquina> {
    return this.http.get<Maquina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener maquinas', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createMaquina(maq: Maquina): Observable<Maquina> {
    return this.http
      .post<Maquina>(this.urlEndPoint, maq, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al crear maquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateMaquina(maq: Maquina): Observable<Maquina> {
    
    return this.http.put<Maquina>(`${this.urlEndPoint}/${maq.maq_Id}`, maq, {
        
        headers: this.http_Headers,
        
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al actualizar maquina', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }


}
