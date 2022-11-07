/**
 * Module
 */
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es-VE';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import * as Icons from '@ng-icons/feather-icons';

/**
 * Services
 */
// import { AppConfigService } from './crud-maker/src/services/app-config.service';

/**
 * Pages
 */
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoadingInterceptor } from './crud-maker/src/interceptors/loading.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

/**
 * Init
 */
registerLocaleData(localeEs, 'es');

// export function initConfig(config: AppConfigService) {
//   return config.load();
// }

@NgModule({
  declarations: [AppComponent, LayoutComponent, InicioComponent, LoginComponent, RegisterComponent],
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
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initConfig,
    //   deps: [AppConfigService],
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
