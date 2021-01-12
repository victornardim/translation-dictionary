import { resolve } from 'dns';

const path = require('path');
const fs = require('fs');

export class SettingsDao {
    constructor() { }

    public async init() {
        if (!fs.existsSync(this.getUri())) {
            await this.create();
        }
    }

    public getUri() {
        return path.join(__dirname, '..', 'settings.json');
    }

    public getSettings() {
        return JSON.parse(fs.readFileSync(this.getUri()));
    }

    private async create(): Promise<any> {
        const content = '{\n\t"databasePath": null,\n\t"useExpressionsInQuery": true,\n\t"useTranslationsInQuery": true\n\t"useTranslationsPlural": true\n}';

        return new Promise((resolve, reject) => {
            fs.writeFile(this.getUri(), content, () => {
                resolve(null);
            });
        });
    }
}