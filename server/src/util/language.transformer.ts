import { ValueTransformer } from 'typeorm';
import LanguagesService from '../services/languages.service';

export const languageTransformer = {
    from: (abbreviation) => {
        const languagesService = new LanguagesService();
        const languages = languagesService.index();
        return languages.find(language => language.abbreviation === abbreviation);
    },
    to: (language) => {
        if (typeof (language) === 'object') {
            return language.abbreviation;
        } else {
            return language;
        }
    }
} as ValueTransformer;