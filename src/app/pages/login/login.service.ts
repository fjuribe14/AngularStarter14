import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';
import { Attribute } from 'src/app/crud-maker/model/attribute';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends ActiveRecordService {
  static override permissions = {
    create: '',
    read: '',
    update: '',
    delete: '',
  };

  public override name = 'Login';
  public override endpoint = 'auth/login';
  public override primaryKey = 'client_id';

  public override attributes: Attribute[] = [
    new Attribute({
      name: 'email',
      label: 'Correo',
      type: 'string',
      value: '',
      input: {
        type: 'text',
        required: true,
        validations: [Validators.required, Validators.email],
      },
    }),

    new Attribute({
      name: 'password',
      label: 'Contraseña',
      type: 'string',
      value: '',
      input: {
        type: 'password',
        required: true,
        setter: (value: string) => btoa(value),
        validations: [Validators.required, Validators.minLength(8)],
        class: 'mt-4 mb-3',
      },
    }),

    new Attribute({
      name: 'grant_type',
      label: 'grant_type',
      type: 'string',
      value: 'password',
      input: {
        type: 'hidden',
      },
    }),

    new Attribute({
      name: 'client_id',
      label: 'client_id',
      type: 'string',
      value: '1',
      input: {
        type: 'hidden',
      },
    }),
  ];

  public override boot() {
    this.canCreate = () => true;
    this.canDelete = () => false;
    this.canRead = () => true;
    this.canUpdate = () => true;
  }
}
