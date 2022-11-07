import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
})
export class InputSelectComponent implements OnInit {
  @Input() data: FormInput;
  @Input() isForm = true;
  @Input() forceReadOnly = false;
  @Input() forceValidation = false;
  public keys = Object.keys;
  constructor(
    private elementRef: ElementRef,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${index}`;
  };

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
