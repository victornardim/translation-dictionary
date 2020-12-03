import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState } from '../shared/app-state.enum';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private stateChange$ = new BehaviorSubject<AppState>(AppState.OFFLINE);

    public changeAppState(state: AppState) {
        this.stateChange$.next(state);
    }

    public listenToStateChange(): Observable<AppState> {
        return this.stateChange$.asObservable();
    }
}