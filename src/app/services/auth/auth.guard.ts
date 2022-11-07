import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertService } from '../alert.service';

/**
 * Clase representativa de un evento ejecutable para autenticación, a través de un manejador de eventos,
 * permitiendo al usuario la habilidad de acceder a un componente
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  private fecha: any;

  private obsParam$: Subject<void> = new Subject<void>();
  subscriptionFechaSistema: any;

  /**
   * Método constructor de la clase
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  /**
   * Método ejecutable que permite verificar si se encuentra un usuario con sesión activa en la
   * aplicación, verificando la información relacionada al token de acceso, con el uso del
   * servicio de autenticación
   * @returns objeto de tipo Observable, Promise, boolean o UrlTree, con el resultado de las
   * verificaciones
   */
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.estaAutenticado()) {
      return true;
    }
    this.router.navigate(['/Login']);
    return false;
  }

  /**
   * Método que se ejecuta al momento de destrucción de la clase.
   */
  ngOnDestroy() {
    this.obsParam$.next();
    this.obsParam$.complete();
  }
}
