import { getRepository } from 'typeorm';
import Translation from '../models/translation';

export default class TranslationsDao {
    public async getByExpression(expressionId: number): Promise<Translation[]> {
        const translationsRepository = getRepository(Translation);

        const translations = await translationsRepository.find({
            where: {
                expression: expressionId
            }
        });

        return translations;
    }

    public async removeMany(translationsId: number[]) {
        const translationsRepository = getRepository(Translation);

        if (translationsId.length) {
            await translationsRepository.delete(translationsId);
        }
    }
}