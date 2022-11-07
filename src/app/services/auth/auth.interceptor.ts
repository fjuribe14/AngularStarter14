import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { AlertService } from '../alert.service';
import { AuthService } from './auth.service';

/**
 * Clase representativa de un evento ejecutable para verificaciones en las peticiones web,
 * a través de un manejador de eventos, permitiendo a la aplicación centralizar el manejo de errores
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private obsParam$: Subject<void> = new Subject<void>();
  nmrPeticiones = 0;

  /**
   * Método constructor de la clase
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  /**
   * Método ejecutable que permite verificar el estado de un error generado en una petición web,
   * con el uso del servicio de autenticación
   * @returns objeto de tipo Observable con el resultado de la petición
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !this.authService.estaAutenticado() &&
      !this.router.url.includes('/Login') &&
      !this.router.url.includes('/RestaurarContrasena') &&
      // !this.router.url.includes('/reset-password') &&
      this.router.url !== '/'
    ) {
      this.router.navigate(['/Login']);
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((e) => {
        switch (e.status) {
          case 400: // Bad Request
            if (e.error.error && e.error.message) {
              this.alertService.showToast(
                e.error.error + ': ' + e.error.message,
                'error'
              );
            }
            break;

          case 401: // Unauthorized
            // if (e.error.message === 'Unauthenticated.') {
            this.nmrPeticiones++;

            if (
              req.url.includes('/api/auth/refresh-session') ||
              req.url.includes('/api/auth/logout') ||
              this.nmrPeticiones >= 6
            ) {
              this.nmrPeticiones = 0;

              if (this.authService.estaAutenticado()) {
                this.authService
                  .logout()
                  .pipe(take(1))
                  .subscribe((resp) => {
                    this.router.navigate(['/Login']).then(() => {
                      this.alertService.showToast(
                        'components.auth.sesion.expiracion',
                        'error'
                      );
                    });
                  });
              } else {
                if (!this.router.url.includes('/Login')) {
                  this.router.navigate(['/Login']).then(() => {
                    this.alertService.showToast(
                      'components.auth.sesion.desconexion',
                      'error'
                    );
                  });
                }
              }
            }
            break;

          case 403: // Forbidden
            this.router.navigate(['/Inicio']).then(() => {
              this.alertService.showToast(
                'components.auth.permiso.denegado',
                'error'
              );
            });
            break;

          case 422: // Unprocessable Entity
            if (e.error.error && e.error.message) {
              this.alertService.showToast(
                e.error.error + ': ' + e.error.message,
                'error'
              );
            }
            break;

          case 429: // Too Many Requests
            if (e.error.error && e.error.message) {
              this.alertService.showToast(
                e.error.error + ': ' + e.error.message,
                'error'
              );
            } else {
              this.alertService.showToast('components.auth.peticion.exceso');
            }
            break;

          case 500: // Internal Server Error
            if (e.error.error && e.error.message) {
              this.alertService.showToast(
                e.error.error + ': ' + e.error.message,
                'error'
              );
            } else {
              this.alertService.showToast('components.auth.peticion.servidor');
            }
            break;

          default:
            if (e.error.error && e.error.message) {
              this.alertService.showToast(
                e.error.error + ': ' + e.error.message,
                'error'
              );
            } else {
              this.alertService.showToast('components.auth.peticion.servidor');
            }
            break;
        }

        return throwError(e);
      })
    );
  }
}
