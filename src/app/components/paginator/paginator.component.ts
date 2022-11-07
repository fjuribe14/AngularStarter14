import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input() model: any = { pagination: null };
  @Input() simplePagination: boolean = false;
  paginas: number[] | undefined;

  desde = 0;
  hasta = 0;

  @Output()
  eventNextPage = new EventEmitter<number>();

  timeout: any;

  /**
   * Método constructor de la clase
   */
  constructor(private elementRef: ElementRef) {}

  /**
   * Método que se ejecuta al momento de carga inicial de la clase.
   * Realiza la inicialización de las propiedades del paginador
   */
  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.initPaginator();
      this.ngOnInit();
    }, 500);
  }

  trackById = (index: number, item: any) => {
    return `${item}`;
  };

  /**
   * Método que permite inicializar las propiedades del paginador, tomando en cuenta las
   * características disponibles en la lista informativa
   */
  private initPaginator(): void {
    if (this.model.pagination != undefined) {
      this.desde = Math.min(
        Math.max(1, this.model.pagination.current_page - 4),
        (this.model.pagination.totalPages != undefined
          ? this.model.pagination.totalPages
          : this.model.pagination.last_page) - 5
      );
      this.hasta = Math.max(
        Math.min(
          this.model.pagination.totalPages != undefined
            ? this.model.pagination.totalPages
            : this.model.pagination.last_page,
          this.model.pagination.current_page + 4
        ),
        6
      );

      if (
        (this.model.pagination.totalPages != undefined
          ? this.model.pagination.totalPages
          : this.model.pagination.last_page) > 5
      ) {
        this.paginas = new Array(this.hasta - this.desde + 1)
          .fill(0)
          .map((valor, indice) => indice + this.desde);
      } else {
        this.paginas = new Array(
          this.model.pagination.totalPages != undefined
            ? this.model.pagination.totalPages
            : this.model.pagination.last_page
        )
          .fill(0)
          .map((valor, indice) => indice + 1);
      }
    }
  }

  nextPage(page: number) {
    this.eventNextPage.emit(page);

    this.model.setPage(page).showLoading(true).all();
  }

  next(): void {
    this.eventNextPage.emit();
    this.model.nextPage().showLoading(true).all();
  }

  prev(): void {
    this.eventNextPage.emit();
    this.model.prevPage().showLoading(true).all();
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
    clearTimeout(this.timeout);
  }
}
