import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Region } from '../models/region';

import { map } from 'rxjs/operators';
import { Comuna } from '../models/comuna';


@Injectable({
  providedIn: 'root'
})
export class RegionComunaChileService {
  private urlEndPoint: string = 'https://apis.digital.gob.cl/dpa/regiones';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getListRegiones(): Observable<Region[]>{
    return this.http.get(this.urlEndPoint).pipe(
      map(rs => rs as Region [])
    )
  }

  getListComunas(codigo: string): Observable<Comuna[]>{
    return this.http.get(`${this.urlEndPoint}/${codigo}/comunas`).pipe(
      map(rs => rs as Comuna [])
    )

  }
}

