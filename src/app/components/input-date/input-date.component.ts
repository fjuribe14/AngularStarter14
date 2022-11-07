import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
})
export class InputDateComponent implements OnInit {
  @Input() data?: FormInput;
  @Input() isForm = true;
  @Input() forceReadOnly = false;
  @Input() forceValidation = false;

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
