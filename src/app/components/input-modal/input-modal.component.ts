import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
})
export class InputModalComponent implements OnInit {
  @Input() public data: FormInput;
  @Input() public model!: ActiveRecordService;
  @Input() public component: any;
  @Input() public item: any;
  @Input() public fields = [];
  @Input() forceReadOnly = false;
  constructor(public ngbModal: NgbModal) {}

  ngOnInit() {}

  open() {
    const modal = this.ngbModal.open(this.component, {
      centered: true,
      size: 'xl',
    });

    modal.result.then((res: any) => {
      this.item = res;
      this.data.value = res[this.data.name];
    });
  }

  delete() {
    if (window.confirm('Desea eliminar el elemento de configuración ?'))
      return (this.data.value = null);
  }
}
