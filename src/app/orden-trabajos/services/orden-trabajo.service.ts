import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrdenTrabajo } from '../models/orden-trabajo';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {

  private urlEndPoint: string = 'http://localhost:8080/api/ot';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getListOt(): Observable<OrdenTrabajo[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as OrdenTrabajo[]));
  }

  getOt(id: string): Observable<OrdenTrabajo> {
    return this.http.get<OrdenTrabajo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener OT', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createOt(ot: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http
      .post<OrdenTrabajo>(this.urlEndPoint, ot, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al crear OT', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateOt(ot: OrdenTrabajo): Observable<OrdenTrabajo> {
    
    return this.http.post<OrdenTrabajo>(`${this.urlEndPoint}/${ot.otr_Id}`, ot, {
        
        headers: this.http_Headers,
        
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al actualizar OT', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }
}
