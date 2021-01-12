import { SettingsDao } from '../dao/settings.dao'

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

    public getSettings() {
        return this.dao.getSettings();
    }
}