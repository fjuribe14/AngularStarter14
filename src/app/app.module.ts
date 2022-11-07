/**
 * Module
 */
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es-VE';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { LoadingInterceptor } from './services/loading.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import * as Icons from '@ng-icons/feather-icons';
import { AppConfigService } from './services/app-config.service';
import { QrCodeModule } from 'ng-qrcode';

/**
 * Pages
 */
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './components/button/button.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormComponent } from './components/form/form.component';
import { InputDateTimeComponent } from './components/input-date-time/input-date-time.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputDatepickerComponent } from './components/input-datepicker/input-datepicker.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { InputMultipleComponent } from './components/input-multiple/input-multiple.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { InputSwitchComponent } from './components/input-switch/input-switch.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { InputTimepickerComponent } from './components/input-timepicker/input-timepicker.component';
import { LayoutComponent } from './components/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ShowQrComponent } from './components/show-qr/show-qr.component';
import { SidenavLinkComponent } from './components/sidenav/sidenav-link.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TableComponent } from './components/table/table.component';

/**
 * Init
 */
registerLocaleData(localeEs, 'es');

export function initConfig(config: AppConfigService) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    TableComponent,
    ButtonComponent,
    SidenavComponent,
    SidenavLinkComponent,
    NavbarComponent,
    BreadcrumbsComponent,
    PaginatorComponent,
    ShowQrComponent,
    /**
     * Form
     */
    FiltersComponent,
    FormComponent,
    FiltersComponent,
    InputTextComponent,
    InputTextareaComponent,
    InputSelectComponent,
    InputDateComponent,
    InputDateTimeComponent,
    InputDatepickerComponent,
    InputMultipleComponent,
    InputFileComponent,
    InputSwitchComponent,
    InputTimepickerComponent,
    InputPasswordComponent,
    InicioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    QrCodeModule,
    SweetAlert2Module.forRoot(),
    NgIconsModule.withIcons({ ...Icons }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, './assets/lang/', '.json'),
        deps: [HttpClient],
      },
      defaultLanguage: 'es',
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
