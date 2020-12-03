import languages from '../data/languages.json';
import Language from '../models/language';

export default class LanguagesDao {
    public index(): Language[] {
        return languages;
    }
}