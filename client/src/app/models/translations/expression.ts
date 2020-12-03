import { Language } from './language';
import { Translation } from './translation';

export interface ExpressionEnvelope {
    data: Expression[];
    count: number;
}

export interface Expression {
    id: number;
    value: string;
    sourceLanguage: Language;
    description: string;
    translations: Translation[]
}