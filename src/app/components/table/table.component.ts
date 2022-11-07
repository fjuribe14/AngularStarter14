import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  @Input() model: ActiveRecordService;
  @Input() errors: any[] = [];
  @Input() totals: any[] = [];
  @Input() simplePagination: boolean = false;
  @Input() classTable: string;
  @Input() back: boolean = false;

  title: any;

  public toggleViews: boolean = false;
  constructor(public location: Location) {}

  ngOnInit(): void {
  }

  order: any = {
    col: '',
    sort: '',
  };

  trackById = (index: number, item: any): number => {
    return index;
  };

  trackByItem = (index: number, item: any): string => {
    return item[this.model.primaryKey];
  };

  orderBy(column: string) {
    this.order.sort = this.order.sort == 'ASC' ? 'DESC' : 'ASC';
    this.order.sort = this.order.col != column ? 'ASC' : this.order.sort;
    this.order.col = column;
    this.model.orderBy(column, this.order.sort).all();
  }

  getOrderIcon(column: string): string {
    if (this.order.col != column) {
      return `feather-filter`;
    }
    if (this.order.sort == 'ASC') {
      return `feather-chevron-down`;
    }
    return `feather-chevron-up`;
  }
}
