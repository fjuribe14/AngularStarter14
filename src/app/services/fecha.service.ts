import { Injectable } from '@angular/core';
import * as moment from 'moment';

/**
 * Clase representativa del servicio para fechas en relación a la gestión de las mismas
 * tomando en cuenta las acciones a realizar en la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class FechaService {
  public readonly DATE_FORMAT_DDMAHMS_ANG: string =
    'EEEE, dd \\"de\\" MMMM \\"de\\" yyyy - hh:mm:ss a';

  public readonly DATE_FORMAT_DDMAHMS_MOM: string =
    'dddd, DD [de] MMMM [de] YYYY - hh:mm:ss a';

  public readonly DATE_FORMAT_AMDHMS_MOM: string = 'YYYYMMDDhhmmss';

  public readonly DATE_FORMAT_DMAHMS_MOM: string = 'DD-MM-YYYY HH:mm:ss a';

  public readonly DATE_FORMAT_DMAHMS_SYS: string = 'DD-MM-YYYY HH:mm:ss';

  public readonly DATE_FORMAT_DMA_MOM: string = 'DD-MM-YYYY';

  public readonly DATE_FORMAT_AMD_MOM: string = 'YYYY-MM-DD';

  public readonly DATE_FORMAT_HTML5_MOM: string =
    moment.HTML5_FMT.DATETIME_LOCAL_MS;

  private readonly MOMENT_LOCALE: string = 'es';

  public readonly DATE_FORMAT_HMS: string = 'HH:mm:ss';

  public readonly DATE_FORMAT_HM: string = 'HH:mm';

  public readonly DATE_FORMAT_AMD_ORACLE: string = 'yyyy/mm/DD';


  /**
   * Método constructor de la clase
   */
  constructor() {
    moment.locale(this.MOMENT_LOCALE);
  }

  /**
   * Método que permite obtener un objeto manejable de fechas a partir de la
   * fecha actual que mantiene la libreria moment
   * @returns objeto de tipo Any con la fecha, excepción en caso contrario
   */
  obtenerFechaAutogeneradaEnObjeto(): any {
    return moment();
  }

  /**
   * Método que permite obtener un objeto manejable de fechas a partir de una fecha obtenida
   * como parámetro
   * @returns objeto de tipo Any con la fecha, excepción en caso contrario
   */
  obtenerFechaEnObjeto(date: any): any {
    return moment(date);
  }

  /**
   * Método que permite obtener un objeto manejable de fechas a partir de los
   * elementos unitarios que conforman una fecha
   * @returns objeto de tipo Any con la fecha, excepción en caso contrario
   */
  obtenerFechaDesdeUnidadesEnObjeto(
    day: number,
    month: number,
    year: number
  ): any {
    return moment({ year, month, day });
  }

  /**
   * Método que permite realizar el formato de una fecha proveniente de un formato en específico,
   * ambos valores obtenidos como parámetros
   * @returns objeto de tipo Any con la fecha, excepción en caso contrario
   */
  obtenerFechaConFormatoEnObjeto(date: any, formato: string): any {
    return moment(date, formato);
  }

  /**
   * Método que permite realizar el formato de una fecha hacia un formato indicado, ambos valores
   * obtenidos como parámetros
   * @returns objeto de tipo Any con la fecha formateada, excepción en caso contrario
   */
  obtenerFechaFormateadaEnString(date: any, formato: string): any {
    return moment(date).format(formato);
  }

  /**
   * Método que permite realizar el formato de una fecha hacia un formato indicado, a partir de los
   * elementos unitarios que conforman la fecha misma, con todos los valores
   * obtenidos como parámetros
   * @returns objeto de tipo Any con la fecha formateada, excepción en caso contrario
   */
  obtenerFechaDesdeUnidadesFormateadaEnString(
    day: number,
    month: number,
    year: number,
    formato: string
  ): any {
    const date = moment({ year, month, day });
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return date.format(formato);
  }

  /**
   * Método que permite realizar el formato de una fecha proveniente de un formato en específico
   * hacia otro formato en específico, con los tres valores obtenidos como parámetros
   * @returns objeto de tipo Any con la fecha formateada, excepción en caso contrario
   */
  obtenerFechaConFormatoFormateadaEnString(
    date: any,
    formato: string,
    formato2: string
  ): any {
    return moment(date, formato).format(formato2);
  }

  obtenerComparacionFechas(date1: any, date2: any): any {
    return moment(date1).isAfter(moment(date2));
  }
}
