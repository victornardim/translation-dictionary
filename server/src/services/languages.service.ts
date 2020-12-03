import LanguagesDao from '../dao/languages.dao';

export default class LanguagesService {
    private languagesDao: LanguagesDao;

    constructor() {
        this.languagesDao = new LanguagesDao();
    }

    public index() {
        return this.languagesDao.index();
    }
}