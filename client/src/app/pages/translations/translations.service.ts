import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TranslationsService {
    private closeModal$ = new Subject<void>();

    public closeModal() {
        this.closeModal$.next();
    }

    public listenToCloseModal(): Observable<void> {
        return this.closeModal$.asObservable();
    }
}