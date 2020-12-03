import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expression, ExpressionEnvelope } from 'src/app/models/translations/expression';
import { environment } from 'src/environments/environment';

import { Language, LanguageEnvelope } from '../models/translations/language';
import { AbstractService } from './abstract.service';

@Injectable({
    providedIn: 'root'
})
export class ExpressionsService extends AbstractService {
    public get(page: number = 1, pageSize: number = 25, filter?: string, order?: string): Observable<ExpressionEnvelope> {
        let url = `${environment.BASE_URL}/expressions?page=${page}&page_size=${pageSize}&order=${order}`;
        if (!!filter) {
            url += `&filter=${filter}`;
        }

        const headers = this.getAuthHeader();

        return this.http
            .get(url, { headers }) as Observable<ExpressionEnvelope>;
    }

    public create(expression: Expression): Observable<any> {
        const url = `${environment.BASE_URL}/expressions`;
        const headers = this.getAuthHeader();

        return this.http
            .post(url, expression, { headers });
    }

    public edit(expression: Expression): Observable<any> {
        const url = `${environment.BASE_URL}/expressions`;
        const headers = this.getAuthHeader();

        return this.http
            .put(url, expression, { headers });
    }

    public delete(id: number): Observable<any> {
        const url = `${environment.BASE_URL}/expressions/${id}`;
        const headers = this.getAuthHeader();

        return this.http
            .delete(url, { headers });
    }

    public getLanguages(): Observable<LanguageEnvelope> {
        const url = `${environment.BASE_URL}/languages`;
        const headers = this.getAuthHeader();

        return this.http
            .get(url, { headers }) as Observable<LanguageEnvelope>;
    }
}