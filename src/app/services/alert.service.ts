import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';

type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

type SweetAlertPosition =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'top-left'
  | 'top-right'
  | 'center'
  | 'center-start'
  | 'center-end'
  | 'center-left'
  | 'center-right'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom-left'
  | 'bottom-right';

@Injectable({ providedIn: 'root' })
export class AlertService {
  toasts: any[] = [];
  modalRef: any;

  constructor(public injector: Injector) {}

  simpleAlert() {
    Swal.fire('Hello Angular');
  }

  showAlert({
    position = 'center',
    icon = 'info',
    title,
    text = 'Pon un texto',
    showConfirmButton = false,
    useTranslation = false,
    timer = 2500,
  }: {
    position?: SweetAlertPosition;
    icon?: SweetAlertIcon;
    title?: string;
    text: string;
    showConfirmButton?: boolean;
    useTranslation?: boolean;
    timer?: number;
  }) {
    if (useTranslation) {
      const translate = this.injector.get(TranslateService);
      translate
        .get(text)
        .pipe(take(1))
        .subscribe((mensaje) => (text = mensaje));
    }
    Swal.fire({
      position,
      icon,
      title,
      text,
      showConfirmButton,
      timer,
    });
  }

  showToast(
    textOrTpl: string,
    typee: SweetAlertIcon = 'info',
    message: string = ' ',
    position: SweetAlertPosition = 'center',
    confirmButton: boolean = false,
    useTranslation: boolean = true,
    timer: number = 2000
  ) {
    if (useTranslation) {
      const translate = this.injector.get(TranslateService);
      translate
        .get(textOrTpl)
        .pipe(take(1))
        .subscribe((mensaje) => {
          textOrTpl = mensaje;
        });
    }
    Swal.fire({
      position: position,
      icon: typee,
      title: textOrTpl,
      text: message,
      showConfirmButton: confirmButton ? confirmButton : false,
      timer: !confirmButton ? timer : null,
    });
  }

  erroalert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href>Why do I have this issue?</a>',
    });
  }
  topend() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  openModalConfirmation(
    title: string = '',
    body: string = '',
    textButtonOk: string = 'Si',
    textButtonCancel: string = 'No'
  ) {
    return Swal.fire({
      title: title,
      text: body,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textButtonOk,
      cancelButtonText: textButtonCancel,
    });
  }

  // /**
  //  * mostrar alerta tipo toast
  //  * @param textOrTpl string | TemplateRef<any> texto o template a renderizar;
  //  * @param type 'success' || 'danger' || 'primary' || 'warning' || 'secundary' || 'light';
  //  * @param useTranslation boolean indica si se van a utilizar traducciones sobre el texto. Por defecto es true;
  //  */
  // showToast(textOrTpl: string | TemplateRef<any>, type: typeof type_alert_color = 'light', useTranslation: boolean = true) {
  //   // const options: any = {
  //   //   delay: 6000,
  //   //   classname: 'text-dark '
  //   // };

  //   // if (type !== 'light') {
  //   //   options.classname = 'text-light bg-' + type;
  //   // }

  //   // if (typeof textOrTpl === 'string') {
  //   //   if (useTranslation) {
  //   //     const translate = this.injector.get(TranslateService);
  //   //     translate.get(textOrTpl).pipe(take(1)).subscribe(mensaje => {
  //   //       textOrTpl = mensaje;
  //   //       this.toasts.push({ textOrTpl, ...options });
  //   //     });
  //   //   } else {
  //   //     this.toasts.push({ textOrTpl, ...options });
  //   //   }
  //   // } else {
  //   //   this.toasts.push({ textOrTpl, ...options });
  //   // }
  //   Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
  // }

  // /**
  //  * mostrar modal de comfirmacion
  //  * @param title titulo o header para el modal
  //  * @param body body para el modal
  //  * @param textButtonOk texto para el boton de ok por defecto 'Ok'
  //  * @param textButtonCancel texto para el boton de cancelar por defecto 'cancelar'
  //  */
  // openModalConfirmation(title: string = '', body: string = '', textButtonOk: string = null, textButtonCancel: string = null): Promise<any> {

  //   this.modalRef = this._modalService.open(NgbdModalComponent, { centered: true, backdrop: 'static' });

  //   this.modalRef.componentInstance.modalConfirm = true;
  //   this.modalRef.componentInstance.title = title;
  //   this.modalRef.componentInstance.body = body;

  //   textButtonOk != null ?
  //     this.modalRef.componentInstance.textButtonOk = textButtonOk
  //     : null
  //     ;
  //   textButtonCancel != null ?
  //     this.modalRef.componentInstance.textButtonCancel = textButtonCancel
  //     : null
  //     ;

  //   return this.modalRef.result;
  // }

  // /**
  //  * mostrar modal
  //  * @param title titulo o header para el modal
  //  * @param body body para el modal
  //  * @param textButtonOk texto para el boton de ok por defecto 'Ok'
  //  * @param textButtonCancel texto para el boton de cancelar por defecto 'cancelar'
  //  */
  // openModal(title: string = '', body: string | TemplateRef<any>, textButtonOk?: string, size?: string, custonWindowClass?: string, custonBackdropClass?: string): Promise<any> {

  //   this.modalRef = this._modalService.open(
  //     NgbdModalComponent, {
  //       centered: true,
  //       backdrop: 'static',
  //       size,
  //       windowClass: custonWindowClass,
  //       backdropClass: custonBackdropClass
  //     }
  //   );

  //   this.modalRef.componentInstance.title = title;
  //   this.modalRef.componentInstance.body = body;

  //   textButtonOk != null ?
  //     this.modalRef.componentInstance.textButtonOk = textButtonOk
  //     : null
  //     ;

  //   return this.modalRef.result;
  // }

  // /**
  // * mostrar modal
  // * @param title titulo o header para el modal
  // * @param body body para el modal
  // * @param textButtonOk texto para el boton de ok por defecto 'Ok'
  // * @param textButtonCancel texto para el boton de cancelar por defecto 'cancelar'
  // */
  // openAlert(title: string = '', body: string = '', textButtonOk: string = null, textButtonCancel: string = null): Promise<any> {

  //   this.modalRef = this._modalService.open(NgbdModalComponent, { centered: true, backdrop: 'static' });

  //   this.modalRef.componentInstance.title = title;
  //   this.modalRef.componentInstance.body = body;

  //   textButtonOk != null ?
  //     this.modalRef.componentInstance.textButtonOk = textButtonOk
  //     : null
  //     ;
  //   textButtonCancel != null ?
  //     this.modalRef.componentInstance.textButtonCancel = textButtonCancel
  //     : null
  //     ;

  //   return this.modalRef.result;
  // }
}
