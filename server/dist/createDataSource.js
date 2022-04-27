"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const type_rom_config_1 = __importDefault(require("./type-rom.config"));
exports.AppDataSource = new typeorm_1.DataSource(type_rom_config_1.default);
//# sourceMappingURL=createDataSource.js.map