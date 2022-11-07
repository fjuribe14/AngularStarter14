import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Clase representativa de un evento ejecutable para verificaciones en las peticiones web,
 * a través de un manejador de eventos, permitiendo a la aplicación incorporar encabezados
 * personalizados
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  /**
   * Método constructor de la clase
   */
  constructor(private authService: AuthService) { }

  /**
   * Método que incorpora el token de acceso al encabezado de autorización, previo a la realización
   * de una petición web
   * @returns objeto de tipo Observable con la petición y el encabezado 'Authorization' incorporado
   */
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    const token = this.authService.token;

    if (token != null && !req.headers.has('Authorization')) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
