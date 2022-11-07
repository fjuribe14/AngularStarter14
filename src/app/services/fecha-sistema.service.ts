import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { FechaService } from './fecha.service';
import { AppConfigService } from './app-config.service';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FechaSistemaService implements OnDestroy {
  fechaBD: any;

  fechaSistema: BehaviorSubject<any>;

  private obsParam$: Subject<void> = new Subject<void>();
  private obsTimeoutS: BehaviorSubject<any>;

  constructor(
    private authService: AuthService,
    private fechaService: FechaService,
    private appConfigService: AppConfigService
  ) {
    this.fechaSistema = new BehaviorSubject<any>(
      this.fechaService.obtenerFechaAutogeneradaEnObjeto()
    );
    this.obsTimeoutS = new BehaviorSubject<any>(1000);
    this.calcularFechaSistema(true);
  }

  /**
   * Método que permite realizar la búsqueda de la información en relación a las fechas de
   * inicio y cierre para transmisión de archivos, con el uso del servicio de parámetros.
   * Se utiliza el servicio para configuraciones de la aplicación en la sincronización
   * de la fecha del sistema desde base de datos
   */
  calcularFechaSistema(primerCiclo: boolean): void {
    this.authService
      .obtenerFechaBaseDeDatos()
      .pipe(takeUntil(this.obsParam$))
      .subscribe((response) => {
        this.fechaBD = this.fechaService.obtenerFechaEnObjeto(response);

        this.obsTimeoutS.pipe(takeUntil(this.obsParam$)).subscribe(() => {
          setTimeout(() => {
            this.calcularFechaSistema(false);
          }, Number(this.appConfigService.getConfig('TIEMPO_ACT_FECHA_SISTEMA')) * 1000);


          if (primerCiclo) {
            this.obsTimeoutS.pipe(takeUntil(this.obsParam$)).subscribe(() =>
            setInterval(() => {
              this.fechaSistema.next(this.fechaBD.add(1, 'seconds'));
            }, 1000)
            );
          }
        });
      });
  }
  public get obtenerFechaActualSistema(): any {
    return this.fechaSistema.value;
  }

  ngOnDestroy() {
    this.obsParam$.next();
    this.obsParam$.complete();
    this.obsTimeoutS.next(null);
    this.obsTimeoutS.complete();
  }
}
