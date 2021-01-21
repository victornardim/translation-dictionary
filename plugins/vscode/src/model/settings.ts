export interface Settings {
    databasePath: string;
    useExpressions: boolean;
    useTranslations: boolean;
    useTranslationsPlural: boolean;
    wordDescriptionTemplate: string;
    expression: Expression;
}

interface Expression {
    toLowerCase: boolean;
    removeAccents: boolean;
    trimSpaces: boolean;
}