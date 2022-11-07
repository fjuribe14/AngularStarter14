import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FechaService } from './fecha.service';
import { UtilsContrasenaService } from '../pages/configuracion/contrasena/utils_contrasena.service';
import { FechaSistemaService } from './fecha-sistema.service';
import { ConstantesConfig } from './config';

/**
 * Clase representativa del servicio para validaciones de formularios, como contenedora de los
 * métodos relacionados a la gestión de validaciones en los formularios de la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  contrasenaValidators: any[];

  private obsParam$: Subject<void> = new Subject<void>();

  /**
   * Método constructor de la clase
   */
  constructor(
    private formBuilder: FormBuilder,
    private fechaService: FechaService,
    private contrasenaService: UtilsContrasenaService,
    private fechaSistemaService: FechaSistemaService
  ) {}

  /**
   * Método que permite la comparación de valores entre dos campos de un formulario en
   * específico, a partir de los mismos obtenidos por parámetros
   */
  public greaterthan(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.greaterthan) {
        return;
      }

      if (parseFloat(control.value) < parseFloat(matchingControl.value)) {
        control.setErrors({ greaterthan: true });
      } else if (control.hasError('greaterthan')) {
        delete control.errors.greaterthan;
        control.updateValueAndValidity();
      }
    };
  }

  /**
   * Método que permite la comparación de valores entre dos campos de un formulario en
   * específico, a partir de los mismos obtenidos por parámetros
   */
  public smallerthan(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.smallerthan) {
        return;
      }

      if (parseFloat(control.value) > parseFloat(matchingControl.value)) {
        control.setErrors({ smallerthan: true });
      } else if (control.hasError('smallerthan')) {
        delete control.errors.smallerthan;
        control.updateValueAndValidity();
      }
    };
  }

  /**
   * Método que permite la comparación de dos horas de un formulario en
   * específico, a partir de los mismos obtenidos por parámetros
   */
  private dateSameDate(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustmatchDate) {
        return;
      }
      if (
        this.fechaService
          .obtenerFechaConFormatoEnObjeto(control?.value, 'DD/MM/YYYY HH:mm:ss')
          .isSame(
            this.fechaService.obtenerFechaConFormatoEnObjeto(
              matchingControl?.value,
              'DD/MM/YYYY HH:mm:ss'
            )
          )
      ) {
        control?.setErrors({ mustmatchDate: true });
        matchingControl?.setErrors({ mustmatchDate: true });
      } else {
        control?.setErrors(null);
        matchingControl?.setErrors(null);
      }
    };
  }

  /**
   * Método que permite la comparación de valores entre tres campos de un formulario en
   * específico, a partir de dos valores dependientes dado que permita el cumplimiento de
   * una condición. Los valores son obtenidos como parámetros
   */
  private DependsOnTwoValues(
    controlName: string,
    dependentControlName1: string,
    dependentControlName2: string,
    dependentField: string,
    dependentValue: string
  ) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const dependentControl1 = formGroup.controls[dependentControlName1];
      const dependentControl2 = formGroup.controls[dependentControlName2];
      const dependentControl3 = formGroup.controls[dependentField];

      if (control.errors && !control.errors.dependsontwovalues) {
        return;
      }

      if (dependentControl3.value === dependentValue) {
        control.setErrors(null);
      } else {
        if (
          [null, undefined, ''].includes(dependentControl1.value) ||
          [null, undefined, ''].includes(dependentControl2.value)
        ) {
          control.setErrors({ dependsontwovalues: true });
        } else {
          control.setErrors(null);
        }
      }
    };
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * para asociar el estatus a un usuario
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  associateUserEstatusFormValidators(): FormGroup {
    return this.formBuilder.group(
      {
        estatus: ['', Validators.required],
        fe_status_desde: [''],
        fe_status_hasta: [''],
        usa_fechas: ['0'],
      },
      {
        validator: this.DependsOnTwoValues(
          'estatus',
          'fe_status_desde',
          'fe_status_hasta',
          'usa_fechas',
          '0'
        ),
      }
    );
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de acceso al sistema
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  loginFormValidators(): FormGroup {
    return this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(4),
          Validators.maxLength(254),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(254),
        ],
      ],
    });
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de creacion y edición de un producto
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  productoFormValidators(): FormGroup {
    return this.formBuilder.group(
      {
        co_producto: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
          ],
        ],
        co_medio_pago: ['', Validators.required],
        co_moneda: ['', Validators.required],
        nb_producto: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(60),
          ],
        ],
        st_producto: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(15),
          ],
        ],
        mo_limite_minimo: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(27),
          ],
        ],
        mo_limite_maximo: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(27),
          ],
        ],
        co_calendario: ['', Validators.required],
        ho_inicio: [''],
        ho_fin: [''],
        //in_preliquidado: [''],
        ti_operacion: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(8),
          ],
        ],
        nu_tiempo_permitido: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(6),
          ],
        ],
      },
      {
        validator: [
          this.greaterthan('mo_limite_maximo', 'mo_limite_minimo'),
          this.smallerthan('mo_limite_minimo', 'mo_limite_maximo'),
        ],
      }
    );
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de creacion y edicion de configuracion la avanzada de un producto
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  configavanzaProductoFormValidators(): FormGroup {
    return this.formBuilder.group(
      {
        // in_preliquidado: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.minLength(1),
        //     Validators.maxLength(1),
        //   ],
        // ],
        ho_inicio: ['', [Validators.required]],
        ho_fin: ['', [Validators.required]],
      },
      {
        validator: [this.dateSameDate('ho_inicio', 'ho_fin')],
      }
    );
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de cambio de contraseña para un usuario
   * @returns objeto de tipo Promise con el objeto contenedor de las validaciones de los campos
   */
  editPassUserFormValidators(): Promise<FormGroup> {
    return new Promise((resolve) => {
      this.contrasenaService
        .getListPublic()
        .pipe(takeUntil(this.obsParam$))
        .subscribe((response) => {
          this.contrasenaValidators = response as any[];
          this.contrasenaValidators = this.contrasenaValidators.filter(
            (element: any) => element.status == 1
          );

          const arrayValidations: Array<any> = [];
          arrayValidations.push(Validators.required);

          this.contrasenaValidators.forEach((element) => {
            if (element.regex == 0) {
              if (
                element.cod_requirement ==
                ConstantesConfig.COD_CONTRASENA_MINLEGTH
              ) {
                arrayValidations.push(
                  Validators.minLength(Number(element.value))
                );
              } else if (
                element.cod_requirement ==
                ConstantesConfig.COD_CONTRASENA_MAXLEGTH
              ) {
                arrayValidations.push(
                  Validators.maxLength(Number(element.value))
                );
              }
            } else {
              arrayValidations.push(Validators.pattern(element.value));
            }
          });

          resolve(
            this.formBuilder.group(
              {
                old_password: ['', Validators.required],
                password: ['', arrayValidations],
                password_confirmation: ['', Validators.required],
              },
              {
                validator: this.MustMatch('password', 'password_confirmation'),
              }
            )
          );
        });
    });
  }

  /**
   * Método que permite la comparación de valores entre dos campos de un formulario en
   * específico, a partir de los mismos obtenidos por parámetros
   */
  private MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustmatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustmatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de rutas
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  DescripcionPerfilFormValidators(): FormGroup {
    return this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  /**
   * Método que permite la construcción del grupo de validaciones para los campos del formulario
   * de administracion m,odificacion de hrarios
   * @returns objeto de tipo FormGroup con las validaciones de los campos
   */
  modificarHoraiosFormValidators(): FormGroup {
    return this.formBuilder.group({
      co_medio_pago: ['', [Validators.required]],
      co_producto: [, [Validators.required]],
      ho_inicio: [{ value: '', disabled: true }, [Validators.required]],
      ho_fin: ['', [Validators.required]],
    });
  }


  /**
    * Método que permite la construcción del grupo de validaciones para los campos del formulario
    * de cambio de contraseña de un usuario desde fuera del sistema
    * @returns objeto de tipo FormGroup con las validaciones de los campos
  */
   resetPasswordFormValidators(): Promise<FormGroup> {
    return new Promise(resolve => {
      this.contrasenaService.getListPublic().pipe(
        takeUntil(this.obsParam$)
      ).subscribe(response => {
        this.contrasenaValidators = response;
        this.contrasenaValidators = this.contrasenaValidators.filter((element: any) => element.status == 1);

        var arrayValidations: Array<any> = [];
        arrayValidations.push(Validators.required);

        this.contrasenaValidators.forEach(element => {
          if (element.regex == 0) {
            if (element.cod_requirement == ConstantesConfig.COD_CONTRASENA_MINLEGTH) {
              arrayValidations.push(Validators.minLength(Number(element.value)));
            } else if (element.cod_requirement == ConstantesConfig.COD_CONTRASENA_MAXLEGTH) {
              arrayValidations.push(Validators.maxLength(Number(element.value)));
            }
          } else {
            arrayValidations.push(Validators.pattern(element.value));
          }
        });

        resolve(this.formBuilder.group({
          email: ['', [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(254)]],
          token: ['', [Validators.required]],
          password: ['', arrayValidations],
          password_confirmation: ['', Validators.required]
        },
          {
            validator: this.MustMatch('password', 'password_confirmation')
          }
        ))
      });
    });
  }
}
