import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() title: string;
  @Input() breadcrumbs: BreadcrumbsType[];
  @Input() modelName?: string;

  constructor(public location: Location) {}

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${index}`;
  };
}

export type BreadcrumbsType = {
  active: boolean;
  route: string;
  title: string;
};
