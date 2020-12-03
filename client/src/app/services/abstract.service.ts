import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStore } from '../store/auth.store';

@Injectable({
    providedIn: 'root'
})
export class AbstractService {
    constructor(
        protected http: HttpClient,
        private store: AuthStore) { }

    public getAuthHeader(): HttpHeaders {
        const token = btoa(`${this.store.getAcessToken()}:api_token`);

        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Basic ${token}`);
    }
}