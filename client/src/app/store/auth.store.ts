import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    constructor() { }

    public getAcessToken(): string {
        return localStorage
            .getItem('TRANSLATION_DICTIONARY-access_token');
    }

    public saveAccessToken(token: string) {
        localStorage
            .setItem('TRANSLATION_DICTIONARY-access_token', token);
    }
}