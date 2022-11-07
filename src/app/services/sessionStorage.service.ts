import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  /**
   * guardar parametros en el local storage
   * @param key clave
   * @param value valor
   * @returns ok
   */
  setItem(key: any, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * buscar un valor guardado en local storage por la clave
   * @param key clave
   * @returns
   */
  getItem(key: any) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  /**
   * eliminar un objeto del local storage por la clave
   * @param key clave
   * @returns
   */
  removeItem(key: any) {
    return sessionStorage.removeItem(key);
  }

  /**
   * eliminar todo el contenido del local storage
   * @returns ok
   */
  removeAll() {
    return sessionStorage.clear();
  }
}
