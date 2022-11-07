import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * Clase representativa del servicio de encriptación, como contenedora de los métodos relacionados
 * a la gestión de operaciones en base a encriptación y des-encriptación de datos
 */
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  key: string;

  /**
   * Método constructor de la clase
   */
  constructor() {
    this.key = this.makeKey();
  }

  /**
   * Método que ejecuta la encriptación de un valor en base a una llave específica, ambos
   * valores obtenidos como parámetros
   * @returns objeto de tipo String con el valor encriptado
   */
  set(keys, value) {
    const key: any = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / key.length,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.toString();
  }

  /**
   * Método que ejecuta la des-encriptación de un valor en base a una llave específica, ambos
   * valores obtenidos como parámetros
   * @returns objeto de tipo String con el valor des-encriptado
   */
  get(keys, value) {
    const key: any = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / key.length,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Método que realiza la construcción de una llave automática en base a parámetros
   * de ejecución de la aplicación
   * @returns objeto de tipo String con el valor de la llave encriptada en Base64
   */
  private makeKey(): string {
    return btoa(navigator.userAgent);
  }
}
