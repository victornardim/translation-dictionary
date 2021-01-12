import { ExpressionType } from './expression-type.enum';

export interface Expression {
    value: string;
    plural: string;
    language: string;
    isPlural: boolean;
    type: ExpressionType;
}