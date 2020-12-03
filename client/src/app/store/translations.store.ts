import { Injectable } from '@angular/core';
import { Language } from '../models/translations/language';

@Injectable({
    providedIn: 'root'
})
export class TranslationsStore {

    public getDefaultLanguages(): Language[] {
        const languages = localStorage
            .getItem('TRANSLATION_DICTIONARY-languages');

        if (!!languages) {
            return JSON.parse(languages);
        }

        return [];
    }

    public saveDefaultLanguages(languages: Language[]) {
        localStorage
            .setItem('TRANSLATION_DICTIONARY-languages', JSON.stringify(languages));
    }

    public getDefautPageSize(): number {
        const pageSize = localStorage
            .getItem('TRANSLATION_DICTIONARY-page_size');

        if (!!pageSize) {
            return Number(pageSize);
        }

        return 5;
    }

    public saveDefaultPageSize(pageSize: number) {
        localStorage
            .setItem('TRANSLATION_DICTIONARY-page_size', pageSize.toString());
    }

    public getDefaultTableOrder(): string {
        const tableOrder = localStorage
            .getItem('TRANSLATION_DICTIONARY-table_order');

        if (!!tableOrder) {
            return tableOrder;
        }

        return 'NONE';
    }

    public saveDefaultTableOrder(order: string) {
        localStorage
            .setItem('TRANSLATION_DICTIONARY-table_order', order);
    }
}