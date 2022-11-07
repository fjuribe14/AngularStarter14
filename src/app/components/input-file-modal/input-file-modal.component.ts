import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';
import { AlertService } from 'src/app/services/alert.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-input-file-modal',
  templateUrl: './input-file-modal.component.html',
})
export class InputFileModalComponent implements OnInit {
  @Input() data: FormInput;
  @Input() isForm = true;
  @Input() forceReadOnly = false;
  @Input() forceValidation = false;
  public keys = Object.keys;
  public file: File;
  constructor(
    public translate: TranslateService,
    public ngbModal: NgbModal,
    public appConfigService: AppConfigService,
    public elementRef: ElementRef,
    public alertService: AlertService,
    public http: HttpClient
  ) {}

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${index}`;
  };

  onFileSelect(event: any) {
    this.file = event?.target?.files[0];
  }

  open(content: any) {
    this.ngbModal.open(content, { centered: true }).result.then(() => {
      this.data.value.name = this.file.name;

      const { id_documento_atributo, id_proveedor } = this.data.value;

      const formData = new FormData();
      formData.append('id_documento_atributo', id_documento_atributo);
      formData.append('id_proveedor', id_proveedor);
      formData.append('file', this.file);

      this.alertService
        .openModalConfirmation('¿ Estás seguro de guardar ?', ' ')
        .then(
          (result) => {
            if (result.isConfirmed) {
              this.http
                .post(
                  `${this.appConfigService.getConfig(
                    'URL_BASE_API'
                  )}/api/documento_ec`,
                  formData
                )
                .subscribe((res: any) => {
                  this.alertService.showToast(
                    'Actualizado exitosamente',
                    'success',
                    '',
                    'center',
                    false
                  );
                });
            }
          },
          () => {}
        );
    });
  }

  download() {
    window.open(
      `${this.appConfigService.getConfig(
        'URL_BASE_API'
      )}/api/documento_atributo/descargar/${
        this.data.value.id_documento_atributo
      }`,
      '_blank'
    );
  }

  delete() {
    const { id_documento_atributo } = this.data.value;

    this.alertService
      .openModalConfirmation('¿ Estás seguro de eliminar ?', ' ')
      .then(
        (result) => {
          if (result.isConfirmed) {
            this.http
              .delete(
                `${this.appConfigService.getConfig(
                  'URL_BASE_API'
                )}/api/documento_ec/${id_documento_atributo}`
              )
              .subscribe(() => {
                this.alertService.showToast(
                  'Eliminado exitosamente',
                  'success',
                  '',
                  'center',
                  false
                );
                window.location.reload();
              });
          }
        },
        () => {}
      );
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
