import { Language } from './language';

export interface Translation {
    id: number;
    value: string;
    plural: string;
    language: Language;
}