import TranslationsDao from '../dao/translations.dao';
import Translation from '../models/translation';

export default class TranslationsService {
    private dao: TranslationsDao;

    constructor() {
        this.dao = new TranslationsDao();
    }

    public async getTranslationsToDelete(expressionId: number, translations: Translation[]): Promise<number[]> {
        const savedTranslations = await this.getByExpression(expressionId);

        const translationsId = translations
            .map((translation: Translation) => translation.id);

        return savedTranslations
            .filter(translation => {
                return !translationsId.includes(translation.id);
            }).map(translation => {
                return translation.id;
            });
    }

    public async getByExpression(expressionId: number): Promise<Translation[]> {
        return await this.dao.getByExpression(expressionId);
    }

    public async removeMany(translationsId: number[]) {
        await this.dao.removeMany(translationsId);
    }
}