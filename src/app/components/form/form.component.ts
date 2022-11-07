import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  @Input() model!: ActiveRecordService;
  @Input() formClass!: any;
  @Input() readonly = false;
  @Input() titulo = false;
  @Input() breadcrumbs = false;
  @Input() back: string;
  @Input() redirect: CallableFunction;
  @Input() cancel: CallableFunction;
  @Input() saved: CallableFunction;
  @Input() goBack: CallableFunction;
  @Input() buttons: string = 'up';
  @Input() containerClass: string = 'col-md-7 mx-auto';
  @Input() component!: any;
  @Input() itemModal!: any;
  @Input() fieldsModal!: any[];
  @Input() multimedia: boolean = false;
  @Input() formTitle: string;

  public hasRequired: boolean;

  constructor(
    private location: Location,
    public alertService: AlertService,
    public http: HttpClient,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hasRequired = this.model
      .getFormInputs(this.readonly)
      .some((el: any) => el.required);

    if (!this.goBack) {
      this.goBack = () =>
        window.confirm('Esta seguro de cancelar ?') && this.location.back();
    }
  }

  trackById = (index: number, item: any) => {
    return `${index}`;
  };

  trackByType = (index: number, item: any) => {
    return `${item.attr?.getType(true)}`;
  };

  public save(redirect: any): void {
    const formData = new FormData();

    if (this.multimedia) {
      this.model
        .getFormInputs(this.readonly)
        .forEach((data: any) => formData.append(data.name, data.value));

      this.alertService
        .openModalConfirmation('¿ Estás seguro de guardar ?', ' ')
        .then(
          (result) => {
            if (result.isConfirmed) {
              if (this.route.snapshot.params['id']) {
                formData.append('_method', 'PATCH');
                this.http
                  .post(
                    `${this.model.getUrl()}/${
                      this.route.snapshot.params['id']
                    }`,
                    formData
                  )
                  .subscribe((res: any) => {
                    this.alertService.showToast(
                      `Guardado exitosamente el registro #${
                        res[this.model.primaryKey]
                      }`,
                      'success'
                    );
                    this.location.back();
                  });
              } else {
                this.http
                  .post(this.model.getUrl(), formData)
                  .subscribe((res: any) => {
                    this.location.back();
                    this.alertService.showToast(
                      `Guardado exitosamente el registro #${
                        res[this.model.primaryKey]
                      }`,
                      'success'
                    );
                  });
              }
            }
          },
          () => {}
        );
    } else {
      this.alertService
        .openModalConfirmation('¿ Estás seguro de guardar ?', ' ')
        .then(
          (result) => {
            if (result.isConfirmed) {
              this.model.save((res: any) => {
                this.location.back();
                this.alertService.showToast(
                  `Guardado exitosamente el Registro ${
                    res[this.model.primaryKey]
                  }`,
                  'success'
                );
              });
            }
          },
          () => {}
        );
    }
  }
}
