"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsDao = void 0;
const path = require('path');
const fs = require('fs');
class SettingsDao {
    constructor() { }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(this.getUri())) {
                yield this.create();
            }
        });
    }
    getUri() {
        return path.join(__dirname, '..', 'settings.json');
    }
    getSettings() {
        return JSON.parse(fs.readFileSync(this.getUri()));
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = '{\n\t"databasePath": null,\n\t"useExpressionsInQuery": true,\n\t"useTranslationsInQuery": true\n\t"useTranslationsPlural": true\n}';
            return new Promise((resolve, reject) => {
                fs.writeFile(this.getUri(), content, () => {
                    resolve(null);
                });
            });
        });
    }
}
exports.SettingsDao = SettingsDao;
//# sourceMappingURL=settings.dao.js.map