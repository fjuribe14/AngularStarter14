import { Injectable } from '@angular/core';
import { ActiveRecordService } from '../crud-maker/model/active_record.service';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { formatNumber } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  public status: any[];
  public emojis: any[] = [];
  public user_rosario: number = 43;
  public user_massiel: number = 68;
  public user_carlos: number = 56;
  constructor(public http: HttpClient, public authService: AuthService) {}

  public sortArr(arr: any[], key: string = ''): any[] {
    return key === '' ? _.sortBy(arr) : _.sortBy(arr, key);
  }

  public jsonToString(json: object): string {
    return JSON.stringify(json);
  }

  public getStatusDynamic(
    model: ActiveRecordService,
    name: string
  ): ActiveRecordService {
    return model
      .from('estatus')
      .where('nb_tabla', '=', `tb_${name}`)
      .where('nb_columna', '=', `st_${name}`);
  }

  public cascadeFilters(
    model: ActiveRecordService,
    config: cascadeFiltersType
  ) {
    // destructuring
    const { parent, parentValue, childrens } = config;

    childrens.forEach((childAttr: any, i: number) => {
      model.getAttribute(childAttr).input.value = '';
      model.getAttribute(childAttr).input.disabled =
        model.getAttribute(childrens[i - 1])?.input.value === null ||
        model.getAttribute(childrens[i - 1])?.input.value === '';
      model.getAttribute(childAttr).input.options.filter = (option: any) =>
        option[parent] == parentValue;
    });
  }

  public getIconTipoSolicitud(value: number): string {
    switch (value) {
      case 1:
        return `💣 Incidente`;
      case 2:
        return `📜 Requerimiento`;
      case 3:
        return `🧐 Consulta`;
      case 4:
        return `🔨 Asignación de Trabajo`;
      case 5:
        return `◻ Normal`;
      case 6:
        return `◼ Estándar`;
      case 7:
        return `🔥Emergencia`;
      case 8:
        return `🛎️ Notificacion`;
      default:
        return ` ${value}`;
    }
  }

  public getIconTipoImpacto(value: number): string {
    switch (value) {
      case 1:
        return `<span class="text-danger">⬇ Baja</span>`;
      case 2:
        return `<span >- Media</span>`;
      case 3:
        return `<span class="text-info">⬆ Alta</span>`;
      default:
        return `N/A`;
    }
  }

  public onChanceCascade(
    model: ActiveRecordService,
    value: any,
    attrName: string,
    propName: string,
    filter = (item: any) => item[propName] == value
  ) {
    if (['null', null, undefined].includes(value)) {
      model.getAttribute(attrName).input.options.filter = undefined;
      model.getAttribute(attrName).input.value = undefined;
      model.getAttribute(attrName).input.disabled = true;
    } else {
      model.getAttribute(attrName).input.disabled = false;

      const input = model.getAttribute(attrName).input;

      if (input.options.filter != filter) {
        input.options.filter = filter;
      }
    }

    model.getAttribute(attrName).input.value = undefined;
  }

  public onChangeParent(
    model: ActiveRecordService,
    value: any,
    childName: string,
    parentName: string,
    callback = (item: any) => item[childName] == value
  ) {
    if (!['null', null, undefined].includes(value)) {
      const parent = model.getAttribute(parentName).input;
      const child = model
        .getAttribute(childName)
        .input.options.getOptions()
        .find(callback);

      if (child && parent.value != child[parentName]) {
        parent.value = child[parentName];
      }
    }
  }

  public truncateText({ word = '', length = 20 }): string {
    if (word.length > length) {
      return `${word.substring(0, length)}...`;
    }
    return word;
  }

  public getColorStatusSolicitud(key: string): string {
    let color: string;
    let icon: string;
    switch (key) {
      case 'Asignada':
        color = 'secondary';
        icon = 'check';
        break;
      case 'Cerrada':
        color = 'info';
        icon = 'check';
        break;
      case 'Certificada':
        color = 'primary';
        icon = 'check';
        break;
      case 'Cancelado':
        color = 'danger';
        icon = 'check';
        break;
      default:
        color = 'secondary';
        icon = 'check';
        break;
    }

    //   return `  <i-feather
    //   name="check"
    //   [ngStyle]="{ 'width.rem': 0.875, 'height.rem': 0.875 }"
    // ></i-feather>`;
    return `<div class="bg-${color}-300 border border-2 border-${color} status-circle"></div>`;
  }

  public getEditorUsers(): boolean {
    return [this.user_rosario, this.user_massiel, this.user_carlos, 1].some(
      (el: any) => el == this.authService?.usuario?.id
    );
  }

  public getEmojis() {
    return this.http
      .get(`/assets/emojis/emojis.json`)
      .subscribe((emojis: any[]) => (this.emojis = emojis));
  }

  public formatNumber({
    number,
    locale = 'es',
  }: // digits = '.2-2',
  {
    number: number;
    locale?: string;
    digits?: string;
  }): string {
    return formatNumber(number, locale);
  }
}

export type cascadeFiltersType = {
  parent: string;
  parentValue: any;
  childrens: string[];
};
