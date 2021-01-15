import { SettingsDao } from '../dao/settings.dao'
import { Settings } from '../model/settings';

export class SettingsService {
    private dao: SettingsDao;

    constructor() {
        this.dao = new SettingsDao();
    }

    public async init() {
        await this.dao.init();
    }

    public getUri(): string {
        return this.dao.getUri();
    }

    public getSettings(): Settings {
        return this.dao.getSettings();
    }
}