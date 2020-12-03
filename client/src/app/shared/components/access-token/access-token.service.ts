import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, timeout } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthStore } from 'src/app/store/auth.store';
import { AppState } from '../../app-state.enum';
import { ErrorCodes } from '../../error-codes.enum';
import { AlertService } from '../alerts/alert.service';

@Injectable({
    providedIn: 'root'
})
export class AccessTokenService {
    constructor(
        private authStore: AuthStore,
        private authService: AuthService,
        private alertService: AlertService,
        private appStateService: AppStateService) { }

    private save$ = new EventEmitter<void>();
    private disable$ = new EventEmitter<boolean>();
    private auth$ = new EventEmitter<boolean>();

    public save(token: string) {
        this.authStore.saveAccessToken(token);
        this.authenticate();
        this.save$.next();
    }

    public listenToSave(): Observable<void> {
        return this.save$.asObservable();
    }

    public disable(disabled: boolean) {
        this.disable$.next(disabled);
    }

    public listenToDisable(): Observable<boolean> {
        return this.disable$.asObservable();
    }

    public checkLocalAccessToken() {
        if (!this.authStore.getAcessToken()) {
            this.alertService.error('Opa! Você não tem um token de acesso configurado 😞');
            this.auth$.next(false);
        } else {
            this.authenticate();
            this.auth$.next(true);
        }
    }

    private authenticate() {
        this.authService
            .validate()
            .pipe(
                take(1),
                timeout(5000))
            .subscribe(
                (authValidation) => {
                    if (authValidation.authenticated) {
                        this.appStateService.changeAppState(AppState.ONLINE);
                        this.alertService.success('Ai sim! Seu token de acesso foi validado 😎');
                    } else {
                        this.appStateService.changeAppState(AppState.INVALID_TOKEN);
                        this.alertService.error('Opa! Seu token de acesso está inválido 😣');
                    }

                    this.auth$.next(authValidation.authenticated);
                },
                (err) => {
                    if (!!err.error) {
                        if (err.error.code === ErrorCodes.AUTHORIZATION_FAILED_ERROR) {
                            this.appStateService.changeAppState(AppState.INVALID_TOKEN);
                            this.alertService.error('Opa! Seu token de acesso está inválido 😣');
                        }
                    }

                    this.auth$.next(false);
                }
            );
    }

    public listenToAuthenticate(): Observable<boolean> {
        return this.auth$.asObservable();
    }
}