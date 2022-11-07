import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
})
export class FormModalComponent implements OnInit {
  @Input() model: ActiveRecordService;
  @Input() title: string = ``;
  @Input() readonly: boolean = false;
  @Input() id: any;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertService: AlertService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.model.isNew = !this.id;
    this.id && this.model.show(this.id);
  }

  trackByType = (index: number, item: any) => {
    return `${item.attr?.getType(true)}`;
  };

  public save(redirect?: any): void {
    this.alertService
      .openModalConfirmation('¿ Estás seguro de guardar ?', ' ')
      .then(
        (result) => {
          if (result.isConfirmed) {
            if (this.model.isNew) {
              this.model.save((res: any) => {
                this.alertService.showToast(
                  `Guardado exitosamente el Registro ${
                    res[this.model.primaryKey]
                  }`,
                  'success'
                );
                //
                this.ngbActiveModal.close();
              });
            } else {
              this.model.update(
                {
                  ...this.model.form.value,
                  [this.model.primaryKey]: this.id,
                },
                (res: any) => {
                  this.alertService.showToast(
                    `Guardado exitosamente el Registro ${
                      res[this.model.primaryKey]
                    }`,
                    'success'
                  );
                  //
                  this.ngbActiveModal.close();
                }
              );
            }
          }
        },
        () => {}
      );
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
    this.id = null;
  }
}
