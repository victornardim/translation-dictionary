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
exports.ExtensionService = void 0;
const extension_dao_1 = require("../dao/extension.dao");
class ExtensionService {
    constructor() {
        this.dao = new extension_dao_1.ExtensionDao();
        this.settingsService = null;
    }
    init(settingsService) {
        this.settingsService = settingsService;
        this.dao.init(this.settingsService.getSettings());
    }
    getExpressions(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.dao.getExpressions(filter);
            return rows.map((row) => {
                return {
                    value: row.value,
                    plural: row.plural,
                    language: row.language,
                    isPlural: row.isPlural,
                    type: row.type
                };
            });
        });
    }
}
exports.ExtensionService = ExtensionService;
//# sourceMappingURL=extension.service.js.map