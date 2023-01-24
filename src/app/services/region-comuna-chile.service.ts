import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { Region } from '../models/region';
import swal from 'sweetalert2';

import { map, catchError } from 'rxjs/operators';
import { Comuna } from '../models/comuna';
import { ComunasRegiones } from '../models/comunasRegiones';


@Injectable({
  providedIn: 'root'
})
export class RegionComunaChileService {

  //private urlEndPoint: string = 'https://apis.digital.gob.cl/dpa/regiones';
  private urlEndPointRegiones: string = 'http://localhost:8080/api/regiones';
  private urlEndPointComunas: string = 'http://localhost:8080/api/comunas';

  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getListRegiones(): Observable<ComunasRegiones>{
    return this.http.get<ComunasRegiones>(`${this.urlEndPointRegiones}`).pipe(
      catchError((e) => {
        console.log("Error Servicio",e.error.mensaje);
        swal.fire('Error al obtener regiones', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  getListComunas(codigo: string): Observable<ComunasRegiones>{
    return this.http.get(`${this.urlEndPointComunas}/${codigo}`).pipe(
      map(rs => rs as ComunasRegiones)
    )
  }
}

