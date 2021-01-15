import { Settings } from '../model/settings';

const path = require('path');
const fs = require('fs');

export class SettingsDao {
    constructor() { }

    public async init() {
        if (!fs.existsSync(this.getUri())) {
            await this.createFile();
        }
    }

    public getUri() {
        return path.join(__dirname, '..', 'settings.json');
    }

    public getSettings(): Settings {
        return JSON.parse(fs.readFileSync(this.getUri()));
    }

    private async createFile(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.getUri(), this.getFileContent(), () => {
                resolve(null);
            });
        });
    }

    private getFileContent(): string {
        return JSON.stringify({
            "databasePath": null,
            "useExpressions": true,
            "useTranslations": true,
            "useTranslationsPlural": true,
            "expressionsToLowerCase": false,
            "wordDescriptionTemplate": null
        }, null, 4);
    }
}