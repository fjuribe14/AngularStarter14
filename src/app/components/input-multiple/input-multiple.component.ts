import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';

@Component({
  selector: 'app-input-multiple',
  templateUrl: './input-multiple.component.html',
})
export class InputMultipleComponent {
  @Input() data: FormInput;
  @Input() isForm = true;
  @Input() forceValidation = false;
  @Input() forceReadOnly = false;

  // public notSelected: any[] = [];
  // public selected: any[] = [];
  // public preNotSelected: any[] = [];
  // public preSelected: any[] = [];
  // public arr: any[] = [];

  constructor(
    private elementRef: ElementRef,
    public translate: TranslateService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'No hay resultados';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';
  }

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${item.value}`;
  };

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}

// ngDoCheck(): void {
//   //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
//   //Add 'implements DoCheck' to the class.
//   this.createNewArr();
//   this.setArrays();

// public createNewArr() {
//   this.arr = this.data?.getOptions(this.isForm).slice(1);

//   this.arr.map((el: any) =>
//     this.data.value.some((item: any) => item == el.value)
//       ? (el.select = true)
//       : (el.select = false)
//   );
// }

// public setArrays() {
//   this.notSelected = this.arr.filter((el: any) => !el.select);
//   this.selected = this.arr.filter((el: any) => el.select);
// }

// public setCheckedFromSelected({ target }) {
//   const { value, checked } = target;
//   this.arr.map((el: any) => el.value == value && (el.select = !checked));

//   // this.arr.map((el: any) => el.value == value && (el.select = !checked));
//   // if (checked) {
//   // }
//   // if (!checked) {
//   //   return (this.preSelected = this.preSelected.filter(
//   //     (el: any) => el.value != value
//   //   ));
//   // }
//   // return this.preSelected.push({ value, checked, select: true });
// }
