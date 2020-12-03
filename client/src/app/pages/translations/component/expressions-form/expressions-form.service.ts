import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Expression } from 'src/app/models/translations/expression';

@Injectable({
    providedIn: 'root'
})
export class ExpressionsFormService {
    private edit$ = new Subject<Expression>();
    private resetForm$ = new Subject<void>();

    public edit(expression: Expression) {
        this.edit$.next(expression);
    }

    public resetForm() {
        this.resetForm$.next();
    }

    public listenToEdit(): Observable<any> {
        return this.edit$.asObservable();
    }

    public listenToResetForm(): Observable<any> {
        return this.resetForm$.asObservable();
    }
}