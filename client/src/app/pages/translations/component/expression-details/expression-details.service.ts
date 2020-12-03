import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Expression } from 'src/app/models/translations/expression';

@Injectable({
    providedIn: 'root'
})
export class ExpressionDetailsService {
    private open$ = new Subject<Expression>();

    public open(expression: Expression) {
        this.open$.next(expression);
    }

    public listenToOpen(): Observable<Expression> {
        return this.open$.asObservable();
    }
}