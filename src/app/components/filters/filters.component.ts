import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActiveRecordService } from 'src/app/crud-maker/model/active_record.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit {
  @Input() model!: ActiveRecordService;
  @Input() formClass!: string;
  public isForm = false;
  public show: boolean = false;
  private navbar: any = document.querySelector('.main-navbar');
  private windowHeight: any;
  private filterDOM: any;
  public top: number;
  public height: number;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.windowHeight = window.innerHeight;
    this.top = this.navbar.clientHeight;
    this.filterDOM = document.querySelector('.filters-container');
  }

  toggleFilters() {
    this.show = !this.show;
    if (this.show) {
      this.filterDOM.classList.remove('close');
      this.filterDOM.classList.add('show');
    } else {
      this.filterDOM.classList.remove('show');
      this.filterDOM.classList.add('close');
    }
  }

  public search(): void {
    this.model.searchButton.click(this.model);
    this.toggleFilters();
  }

  ngDoCheck(): void {
    this.height = this.windowHeight - this.top;
    this.top = this.navbar.clientHeight;
  }

  public trackByFilter = (index: number, item: any): string => {
    return `${index}`;
  };

  public disable() {
    const filters = this.model
      .getFilters()
      .filter((item: any) => item.validateFilter);
    for (const filter of filters) {
      if (filter.formControl.status === 'INVALID') {
        return true;
      }
    }
    return false;
  }

  // public isDefaultSearchButton(button: ActionButton): boolean {
  //   return button.icon() === "faSearch" && button.tooltip() === "Buscar" && !button.text;
  // }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
