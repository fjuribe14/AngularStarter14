import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
})
export class InputTextareaComponent implements OnInit {
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
