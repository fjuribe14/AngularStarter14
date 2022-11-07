import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private countRequest = 0;
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.countRequest) {
      this.spinner.show(undefined, {
        type: 'ball-atom',
        size: 'default',
        bdColor: 'rgba(46, 53, 64, 0.8)',
        color: 'white',
        fullScreen: false,
      });
    }
    this.countRequest++;
    return next.handle(request).pipe(
      finalize(() => {
        this.countRequest--;
        if (!this.countRequest) {
          this.spinner.hide();
        }
      })
    );
  }
}
