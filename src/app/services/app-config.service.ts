import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Clase representativa del servicio para configuraciones de la aplicación, como contenedora de
 * los métodos relacionados a la gestión de configuraciones en la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private config: any = null;

  /**
   * Método constructor de la clase
   */
  constructor(private http: HttpClient) {}

  /**
   * Método que permite realizar la búsqueda de la información relacionada a una de las
   * configuraciones de la aplicación, a partir de su llave obtenida como parámetro
   *
   * @returns objeto de tipo String con el valor de la llave, nulo en caso contrario
   */
  public getConfig(key: any) {
    if (this.config == null) {
      return null;
    }

    return this.config[key];
  }

  /**
   * Método que permite realizar la búsqueda de la información relacionada a todas las
   * configuraciones de la aplicación, a partir del archivo JSON de propiedades en el
   * directorio de la aplicación
   */
  public load(): Promise<any> {
    return this.http
      .get<any>('./environments/environment.json')
      .pipe(
        catchError((e: any) => {
          return throwError(e);
        }),
        tap((response: any) => {
          this.config = response;
          return true;
        })
      )
      .toPromise();
  }
}
