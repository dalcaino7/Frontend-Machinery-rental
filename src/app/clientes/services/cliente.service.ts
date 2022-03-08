import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes/';
  private http_Headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getListClientes(): Observable<Cliente[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Cliente[]));
  }

  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        console.log(e.error.mensaje);
        swal.fire('Error al obtener clientes', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  createCliente(cli: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.urlEndPoint, cli, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al crear cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateCliente(cli: Cliente): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.urlEndPoint}/${cli.cli_Id}`, cli, {
        headers: this.http_Headers,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          swal.fire('Error al actualizar cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  /* deleteCliente(id: string): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, 
    {headers: this.http_Headers});
  } */
}
