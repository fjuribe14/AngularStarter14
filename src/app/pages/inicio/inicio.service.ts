import { Injectable } from '@angular/core';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';
import { Attribute } from 'src/app/crud-maker/model/attribute';

@Injectable({
  providedIn: 'root',
})
export class InicioService extends ActiveRecordService {
  static override permissions = {
    create: '',
    read: '',
    update: '',
    delete: '',
  };

  public override name = '';
  public override endpoint = 'saldo_cuenta_diario';
  public override primaryKey = 'co_cuenta';

  public override attributes: Attribute[] = [
    'id_cliente',
    'nb_nombre_a',
    'nb_nombre_b',
    'nb_apellido_a',
    'nb_apellido_b',
    'co_identificacion',
    'co_cuenta',
    'mo_saldo',
  ].map(
    (attr) =>
      new Attribute({
        name: attr,
        label: attr,
        type: 'string',
        input: {
          type: 'text',
        },
      })
  );

  public override boot() {
    this.canCreate = () => true;
    this.canDelete = () => false;
    this.canRead = () => true;
    this.canUpdate = () => true;
  }
}
