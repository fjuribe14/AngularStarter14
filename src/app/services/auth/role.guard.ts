import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../alert.service';
import { AuthService } from './auth.service';

/**
 * Clase representativa de un evento ejecutable para verificación de roles, a través de un manejador de eventos,
 * permitiendo al usuario la habilidad de acceder a un componente
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  /**
   * Clase representativa de un evento ejecutable para autenticación, a través de un manejador de eventos,
   * permitiendo al usuario la habilidad de activar un componente
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  /**
   * Método ejecutable que permite verificar si se encuentra un usuario con sesión activa en la
   * aplicación, verificandola información relacionada al token de acceso, además decomprobar si el usuario
   * contiene en su lista de roles asignados los permisos habilitados para el componente en especifico,
   * con el uso del servicio de autenticación
   * @returns objeto de tipo Observable, Promise, boolean o UrlTree, con el resultado de las
   * verificaciones
   */
  canActivate(
    next: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.estaAutenticado()) {
      const perm = next.data.permissions as Array<string>;

      if (!perm || (perm && this.authService.tienePermisos(perm))) {
        return true;
      }
    }

    this.router.navigate(['/Inicio']).then(() => {
      this.alertService.showToast('components.auth.permiso.denegado', 'error');
    });
    return false;
  }
}
