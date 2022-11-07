import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-date-time',
  templateUrl: './input-date-time.component.html',
})
export class InputDateTimeComponent implements OnInit {
  @Input() data?: FormInput;
  @Input() isForm = true;
  @Input() forceReadOnly = false;
  @Input() forceValidation = false;
  public keys = Object.keys;
  public time = { hour: 13, minute: 30 };
  public today = this.ngbCalendar.getToday();
  public defaultValue: any;

  constructor(
    private elementRef: ElementRef,
    public translate: TranslateService,
    public ngbCalendar: NgbCalendar,
    public ngbDateParserFormatter: NgbDateParserFormatter
  ) {}

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${index}`;
  };

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
