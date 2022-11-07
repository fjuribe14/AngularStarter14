import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../app-config.service';
import { LocalStorageService } from '../localStorage.service';
import { AlertService } from '../alert.service';
@Injectable({
  providedIn: 'root',
})
/**
 * Clase representativa del servicio de autenticación, como contenedora de los métodos relacionados
 * a la gestión de operaciones en base a usuarios y roles
 */
export class AuthService {
  static readonly TOKEN_NAME = 'tToken';
  static readonly REFRESH_TOKEN_NAME = 'rtToken';
  static readonly ROLES_NAME = 'roles';
  static readonly REFRESH_TOKEN_ACTIVE_UPDATE = 'actupdrtToken';
  private params: URLSearchParams;
  // tslint:disable-next-line: variable-name
  private _usuario: any;
  // tslint:disable-next-line: variable-name
  private _token: string;
  // tslint:disable-next-line: variable-name
  private _refreshToken: string;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/x-www-form-urlencoded',
  });
  refreshSessionInProcess: string = 'false';
  /**
   * Método constructor de la clase
   */
  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private appConfigService: AppConfigService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private alertService: AlertService
  ) {
    this.params = new URLSearchParams();
    this.currentUserSubject = new BehaviorSubject<any>(this.usuario);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  /**
   * Método que permite realizar la búsqueda de la dirección URL asociada a la seguridad de
   * usuarios, con el uso del servicio para configuración de la aplicación
   * @returns objeto de tipo String con la dirección URL, nulo en caso contrario
   */
  private getEndPoint(): string {
    return this.appConfigService.getConfig('URL_AUTH_API') + '/api/auth';
  }
  /**
   * Método que permite realizar la búsqueda del encabezado para tipo de contenido a
   * transmitir en las peticiones del servicio
   * @returns objeto de tipo HttpHeaders con el encabezado, nulo en caso contrario
   */
  private getHeaders(): HttpHeaders {
    return this.httpHeaders;
  }
  /**
   * Método que permite realizar la búsqueda de la información relacionada al usuario desde
   * las ubicaciones ofrecidas por la aplicación: 1. Desde la memoria; 2. Desde el almacenamiento local
   * en el navegador; 3. Nuevo usuario. La búsqueda se realiza de forma jerárquica,
   * obteniendose en el caso 2 desde los datos del token de acceso. Se utilizan los servicios
   * para manejo de encriptación, así como el de configuración de la aplicación
   * @returns objeto de tipo Usuario con la información del usuario, objeto nuevo en caso contrario
   */
  public get usuario(): any {
    if (this._usuario != null && this._usuario !== undefined) {
      return this._usuario;
    } else if (
      (this._usuario == null || this._usuario === undefined) &&
      this.localStorageService.getItem(AuthService.TOKEN_NAME) != null
    ) {
      const storage = this.localStorageService.getItem(AuthService.TOKEN_NAME);
      const tokenFromStorage = this.cryptoService.get(
        this.cryptoService.key,
        storage
      );
      const payload = this.obtenerSeccionToken(tokenFromStorage, 1);
      const roles = JSON.parse(
        atob(
          this.cryptoService.get(
            this.cryptoService.key,
            this.localStorageService.getItem(AuthService.ROLES_NAME)
          )
        )
      );
      this._usuario = new Object();
      this._usuario.id = payload.user.id;
      this._usuario.name = payload.user.name;
      this._usuario.email = payload.user.email;
      this._usuario.descripcion = payload.user.descripcion;
      this._usuario.roles = new Array();
      roles.forEach((rol: any) => {
        this._usuario.roles.push(rol);
      });
      this._usuario.avatar = payload.user.avatar;
      return this._usuario;
    }
    return new Object();
  }
  /**
   * Método que permite realizar la búsqueda de la información relacionada al token de acceso desde
   * las ubicaciones ofrecidas por la aplicación: 1. Desde la memoria; 2. Desde el almacenamiento local
   * en el navegador. La búsqueda se realiza de forma jerárquica. Se utilizan los servicios
   * para manejo de encriptación, así como el de configuración de la aplicación
   * @returns objeto de tipo String con el contenido del token, nulo en caso contrario
   */
  public get token(): string {
    this._token = null;
    let localStorageToken = this.localStorageService.getItem(
      AuthService.TOKEN_NAME
    );
    if (localStorageToken != null) {
      this._token = this.cryptoService.get(
        this.cryptoService.key,
        localStorageToken
      );
      return this._token;
    }
    return this._token;
  }
  /**
   * Método que permite realizar la búsqueda de la información relacionada al token de refrescamiento de sesión desde
   * las ubicaciones ofrecidas por la aplicación: 1. Desde la memoria; 2. Desde el almacenamiento local
   * en el navegador. La búsqueda se realiza de forma jerárquica. Se utilizan los servicios de configuración de la aplicación
   * @returns objeto de tipo String con el contenido del token, nulo en caso contrario
   */
  public get refreshToken(): string {
    if (
      this.localStorageService.getItem(AuthService.REFRESH_TOKEN_NAME) != null
    ) {
      const storage = this.localStorageService.getItem(
        AuthService.REFRESH_TOKEN_NAME
      );
      this._refreshToken = this.cryptoService.get(
        this.cryptoService.key,
        storage
      );
      return this._refreshToken;
    }
    return null;
  }
  /**
   * Método que permite realizar la búsqueda de la información relacionada al usuario,
   * con sesión activa, y desde la memoria de la aplicación
   * @returns objeto de tipo Usuario si existe en memoria, null en caso contrario
   */
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  /**
   * Método que permite ejecutar el proceso de acceso a la aplicación, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  login(usuario: any): Observable<any> {
    this.params.set('email', usuario.username);
    this.params.set('password', btoa(usuario.password));
    this.params.set(
      'grant_type',
      this.appConfigService.getConfig('DATA_AUTH_GRANT_APP')
    );
    this.params.set(
      'client_id',
      this.appConfigService.getConfig('DATA_AUTH_CLIENTE')
    );
    return this.http
      .post<any>(`${this.getEndPoint()}/login`, this.params.toString(), {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          this.borrarInformacionUsuario();
          this.guardarPayload(response);
          this.guardarTokens(response);
        })
      );
  }
  /**
   * Método que permite ejecutar el proceso de salida de la aplicación, a partir de los datos del
   * usuario, a través de una petición web a la dirección URL asociada a la seguridad de usuarios
   * @returns objeto de tipo Observable con el resultado de la petición, excepción en caso contrario
   */
  logout(): Observable<any> {
    if (this.estaAutenticado()) {
      return this.http.get<any>(`${this.getEndPoint()}/logout`).pipe(
        tap((response) => {
          if (response.success) {
            this.borrarInformacionUsuario();
            this.router.navigate(['/Login']);
          }
          return response;
        }),
        catchError((e) => {
          if (e.status === 401) {
            this.borrarInformacionUsuario();
            this.router.navigate(['/Login']);
          }
          return throwError(e);
        })
      );
    } else {
      return this.http
        .get('')
        .pipe(tap(() => this.router.navigate(['/Login'])));
    }
  }
  /**
   * Método que permite ejecutar el proceso de acceso a la aplicación, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  crearContrasena(email: any): Observable<any> {
    this.params.set('email', email.email);
    this.params.set(
      'redirect_to',
      window.location.href.substring(0, window.location.href.length - 16) +
        'reset-password'
    );
    return this.http.post<any>(
      `${this.appConfigService.getConfig('URL_AUTH_API')}/api/password/create`,
      this.params.toString(),
      { headers: this.getHeaders() }
    );
  }
  /**
   * Método que permite ejecutar el proceso de acceso a la aplicación, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  resetearContrasena(data: any): Observable<any> {
    this.params.set('email', data.email);
    this.params.set('token', data.token);
    this.params.set('password', data.password);
    this.params.set('password_confirmation', data.password_confirmation);
    return this.http.post<any>(
      `${this.appConfigService.getConfig('URL_AUTH_API')}/api/password/reset`,
      this.params.toString(),
      { headers: this.getHeaders() }
    );
  }
  /**
   * Método que permite ejecutar el proceso de refrescamiento de la sesión, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  refreshSession(): Observable<any> {
    this.params.set('grant_type', 'refresh_token');
    this.params.set('email', this._usuario.email);
    this.params.set('refresh_token', this.refreshToken);
    this.params.set(
      'client_id',
      this.appConfigService.getConfig('DATA_AUTH_CLIENTE')
    );
    return this.http
      .post<any>(
        `${this.getEndPoint()}/refresh-session`,
        this.params.toString(),
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((e) => {
          if (e.status === 500) {
            this.borrarInformacionUsuario();
          }
          return throwError(e);
        }),
        tap((response) => {
          this.borrarInformacionUsuario();
          this.guardarPayload(response);
          this.guardarTokens(response);
        })
      );
  }

  /**
   * Método que permite guardar la información del usuario que accede a la aplicación en la memoria,
   * a partir de un objeto de respuesta recibido como parámetro
   */
  public guardarPayload(response: any): void {
    const payload = this.obtenerSeccionToken(response.access_token, 1);
    let roles = JSON.parse(atob(response.roles));
    this._usuario = new Object();
    this._usuario.id = payload.user.id;
    this._usuario.name = payload.user.name;
    this._usuario.email = payload.user.email;
    this._usuario.descripcion = payload.user.descripcion;
    this._usuario.roles = new Array();
    roles.forEach((rol: any) => {
      this._usuario.roles.push(rol);
    });
    this._usuario.avatar = payload.user.avatar;
    this.currentUserSubject.next(this._usuario);
  }
  /**
   * Método que permite guardar la información de los tokens de acceso y refrescamiento de sesión
   * en la memoria, a partir de un objeto de respuesta
   * recibido como parámetro. Se utilizan los servicios de configuración de la aplicación y de
   * encriptación
   */
  public guardarTokens(response: any): void {
    // this.borrarInformacionUsuario();
    this._token = response.access_token;
    this._refreshToken = response.refresh_token;
    this.localStorageService.setItem(
      AuthService.TOKEN_NAME,
      this.cryptoService.set(this.cryptoService.key, this._token)
    );
    this.localStorageService.setItem(
      AuthService.REFRESH_TOKEN_NAME,
      this.cryptoService.set(this.cryptoService.key, this._refreshToken)
    );
    //save rol
    this.localStorageService.setItem(
      AuthService.ROLES_NAME,
      this.cryptoService.set(this.cryptoService.key, response.roles)
    );
    this.localStorageService.setItem(
      AuthService.REFRESH_TOKEN_ACTIVE_UPDATE,
      this.cryptoService.set(this.cryptoService.key, false)
    );
  }
  /**
   * Método que permite obtener la información específica de una de las secciones pertenecientes
   * al token de acceso
   * @returns objeto de tipo Any que contiene los datos desde el token, parseados a JSON, nulo en
   * caso contrario
   */
  obtenerSeccionToken(accessToken: string, pos: number): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[pos]));
    }
    return null;
  }
  /**
   * Método que permite verificar si se encuentra autenticado un usuario en la sesión actual,
   * con el uso de los servicios para configuración de la aplicación
   * @returns true si se encuentra un usuario autenticado válido, false en caso contrario
   */
  estaAutenticado(): boolean {
    const payload = this.obtenerSeccionToken(this.token, 1);
    if (
      payload != null &&
      this._usuario != null &&
      Number(payload.sub) === Number(this._usuario.id)
    ) {
      return true;
    } else {
      this.borrarInformacionUsuario();
      return false;
    }
  }
  /**
   * Método que permite eliminar los datos asociados a un usuario de la aplicación
   */
  borrarInformacionUsuario(): void {
    this._token = null;
    this._usuario = null;
    this._refreshToken = null;
    this.localStorageService.removeItem(AuthService.TOKEN_NAME);
    this.localStorageService.removeItem(AuthService.REFRESH_TOKEN_NAME);
    this.localStorageService.removeItem(AuthService.ROLES_NAME);
    this.localStorageService.removeItem(
      AuthService.REFRESH_TOKEN_ACTIVE_UPDATE
    );
    this.currentUserSubject.next(null);
  }
  /**
   * Método que permite verificar si una lista de permisos en formato textual contiene algún
   * permiso válido en la sesión actual
   * @returns true si es válido, false en caso contrario
   */
  public tienePermisos(listaPermisos: Array<string>): boolean {
    let isEnabled = false;
    listaPermisos.forEach((permiso) => {
      if (!isEnabled) {
        isEnabled = this.tienePermisoAsignado(permiso);
      }
    });
    return isEnabled;
  }
  /**
   * Método que permite verificar si un permiso obtenido desde un parámetro se encuentra
   * asociado al usuario con sesión activa en la aplicación
   * @returns true si se encuentra asociado, false en caso contrario
   */
  public tienePermisoAsignado(perm: string) {
    if (
      !perm ||
      (this.estaAutenticado() &&
        (this.obtenerPermisosAsignados().includes(perm) ||
          this.usuarioTieneTodosLosPermisos()))
    ) {
      return true;
    }
    return false;
  }
  /**
   * Método que permite verificar si un modulo obtenido desde un parámetro se encuentra
   * asociado al usuario con sesión activa en la aplicación
   * @returns true si se encuentra asociado, false en caso contrario
   */
  public tienePermisoDeModulo(modulo: string) {
    if (
      this.estaAutenticado() &&
      (this.usuarioTienePermisoDeModulo(modulo) ||
        this.usuarioTieneTodosLosPermisos())
    ) {
      return true;
    }
    return false;
  }
  /**
   * Método que permite ejecutar la validación de credenciales, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con el resultado de la petición, excepción en caso contrario
   */
  validarCredenciales(email: string, password: string): Observable<any> {
    this.params.set('email', email);
    this.params.set('password', password);
    this.params.set(
      'grant_type',
      this.appConfigService.getConfig('DATA_AUTH_GRANT_APP')
    );
    this.params.set(
      'client_id',
      this.appConfigService.getConfig('DATA_AUTH_CLIENTE')
    );
    return this.http.post<any>(
      `${this.getEndPoint()}/user/credenciales/check`,
      this.params.toString(),
      { headers: this.getHeaders() }
    );
  }
  obtenerFechaBaseDeDatos() {
    return this.http.get(
      `${this.appConfigService.getConfig('URL_AUTH_API')}/api/systemDateDB`
    );
  }
  public obtenerRolesAsignados(): Array<string> {
    const lista: Array<string> = [];
    this._usuario.roles.forEach((rol) => {
      lista.push(rol.name);
    });
    return lista;
  }
  public obtenerPermisosAsignados(): Array<string> {
    const lista: Array<string> = [];
    this._usuario.roles.forEach((rol) => {
      rol.permissions.forEach((permiso) => {
        lista.push(permiso.cod_permission);
      });
    });
    return lista;
  }
  public usuarioTieneTodosLosPermisos(): boolean {
    let isAdmin = false;
    this._usuario.roles.forEach((rol) => {
      if (rol.all_permissions === '1' && !isAdmin) {
        isAdmin = true;
      }
    });
    return isAdmin;
  }
  /**
   * buscar si un usuario tiene acceso a un modulo del sistema
   * @param modulo modulo al cual pide acceso
   */
  public usuarioTienePermisoDeModulo(modulo: string): boolean {
    let yes = false;
    this._usuario.roles.forEach((rol) => {
      rol.permissions.forEach((permiso) => {
        if (permiso.module === modulo && !yes) {
          yes = true;
        }
      });
    });
    return yes;
  }
  public obtenerNombresDePermisosAsignados(): Array<string> {
    const lista: Array<string> = [];
    this._usuario.roles.forEach((rol) => {
      rol.permissions.forEach((permiso) => {
        lista.push(permiso.display_name);
      });
    });
    return lista;
  }
  /**
   * Método que permite ejecutar la validación de credenciales, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con el resultado de la petición, excepción en caso contrario
   */
  checkCredenciales(email: string, password: string): Observable<any> {
    this.params.set('email', email);
    this.params.set('password', btoa(password));
    this.params.set(
      'grant_type',
      this.appConfigService.getConfig('DATA_AUTH_GRANT_APP')
    );
    this.params.set(
      'client_id',
      this.appConfigService.getConfig('DATA_AUTH_CLIENTE')
    );
    return this.http
      .post<any>(
        `${this.getEndPoint()}/user/credenciales/check`,
        this.params.toString(),
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  /**
   * Método que permite ejecutar el proceso de acceso a la aplicación, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  requestPassword(email: any): Observable<any> {
    this.params.set('email', email);
    this.params.set('redirect_to', location.origin + '/RestaurarContrasena');
    return this.http.post<any>(
      `${this.appConfigService.getConfig('URL_AUTH_API')}/api/password/create`,
      this.params.toString(),
      { headers: this.getHeaders() }
    );
  }
  /**
   * Método que permite ejecutar el proceso de acceso a la aplicación, a partir de los datos del
   * usuario en conjunto con los parametros de la aplicación, a través de una
   * petición web a la dirección URL asociada a la seguridad de usuarios. Se utiliza el servicio de
   * configuración de la aplicación
   * @returns objeto de tipo Observable con los datos de la sesión del usuario, excepción en caso contrario
   */
  resetPassword(data: any): Observable<any> {
    this.params.set('email', data.email);
    this.params.set('token', data.token);
    this.params.set('password', btoa(data.password));
    this.params.set('password_confirmation', btoa(data.password_confirmation));
    return this.http.post<any>(
      `${this.appConfigService.getConfig('URL_AUTH_API')}/api/password/reset`,
      this.params.toString(),
      { headers: this.getHeaders() }
    );
  }
  /**
   * Método que permite realizar la verificación de la fecha actual del sistema en comparación
   * a la fecha de expiración asociada al token de acceso, con el uso del servicio de
   * autenticación, a forma de establecer el estado de la sesión
   */
  public verificarFechaParaRefrescarSesion(fechaBD: any) {
    var rtau = this.localStorageService.getItem(
      AuthService.REFRESH_TOKEN_ACTIVE_UPDATE
    );
    if (rtau != null && rtau != undefined) {
      this.refreshSessionInProcess = this.cryptoService.get(
        this.cryptoService.key,
        rtau
      );
      const payload = this.obtenerSeccionToken(this._token, 1);
      if (payload) {
        const diff = payload.exp - fechaBD.unix();
        if (diff <= 360) {
          this.localStorageService.setItem(
            AuthService.REFRESH_TOKEN_ACTIVE_UPDATE,
            this.cryptoService.set(this.cryptoService.key, true)
          );
          if (this.refreshSessionInProcess === 'false') {
            this.refreshSession().subscribe(() => {
              this.localStorageService.setItem(
                AuthService.REFRESH_TOKEN_ACTIVE_UPDATE,
                this.cryptoService.set(this.cryptoService.key, false)
              );
              this.alertService.showToast('components.auth.sesion.extension');
            });
          }
        } else if (diff <= 120 && this.refreshSessionInProcess === 'false') {
          if (this.estaAutenticado()) {
            this.logout().subscribe(() => {
              this.router.navigate(['/Login']).then(() => {
                this.localStorageService.setItem(
                  AuthService.REFRESH_TOKEN_ACTIVE_UPDATE,
                  this.cryptoService.set(this.cryptoService.key, false)
                );
                this.alertService.showToast(
                  'components.auth.sesion.expiracion'
                );
              });
            });
          }
        }
      } else {
        this.router.navigate(['/Login']);
      }
    }
  }
}
