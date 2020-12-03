import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppStateService } from '../services/app-state.service';
import { AppState } from '../shared/app-state.enum';
import { AccessTokenService } from '../shared/components/access-token/access-token.service';
import { AlertService } from '../shared/components/alerts/alert.service';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private accessTokenService: AccessTokenService,
        private alertService: AlertService,
        private appStateService: AppStateService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (!err.status) {
                    this.accessTokenService.disable(true);
                    this.alertService.error('Xiii! Parece que o servidor está offline 😨');
                    this.appStateService.changeAppState(AppState.OFFLINE);
                }

                return throwError(err);
            })) as Observable<HttpEvent<any>>;
    }
}