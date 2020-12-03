import Translation from "../models/translation";
import TranslationsService from '../services/translations.service';

export default class TranslationsController {
    private service: TranslationsService;

    constructor() {
        this.service = new TranslationsService();
    }

    public async getTranslationsToDelete(expressionId: number, translations: Translation[]): Promise<number[]> {
        return this.service.getTranslationsToDelete(expressionId, translations);
    }

    public async getByExpression(expressionId: number): Promise<Translation[]> {
        return this.service.getByExpression(expressionId);
    }

    public async removeMany(translationsId: number[]) {
        this.service.removeMany(translationsId);
    }
}