import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-qr',
  templateUrl: './show-qr.component.html',
})
export class ShowQrComponent implements OnInit {
  private item: any;
  public qrData: string = ``;
  constructor(public ngbActiveModal: NgbActiveModal) {}

  ngOnInit(): void {
    //
    const {
      id_cliente,
      co_cuenta,
      nb_nombre_a,
      nb_apellido_a,
      co_identificacion,
    } = this.item;
    //
    this.qrData = btoa(
      JSON.stringify([
        {
          id_cuenta: 1,
          id_cliente: id_cliente,
          agent: `${co_cuenta}`.slice(0, 4),
          name: `${nb_nombre_a} ${nb_apellido_a}`,
          scheme_name: 'SCID',
          scheme_name_type: `${co_identificacion}`[0],
          identification: `${co_identificacion}`.slice(
            1,
            co_identificacion.length
          ),
          acct_tp: 'CNTA',
          acct_tp_type: '',
          acct_id: co_cuenta,
          st_cuenta: 'ACTIVO',
          bo_favorito: 0,
          ti_cuenta: 0,
        },
      ])
    );
  }
}
