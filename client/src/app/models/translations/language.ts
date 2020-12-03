export interface LanguageEnvelope {
    languages: Language[];
}

export interface Language {
    name: string;
    abbreviation: string;
    country: string;
}