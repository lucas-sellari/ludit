"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const path_1 = __importDefault(require("path"));
exports.default = {
    type: "postgres",
    host: "localhost",
    port: 5100,
    username: "postgres",
    password: "essasenha123",
    database: "ludit2",
    entities: [Post_1.Post, User_1.User],
    logging: true,
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./migrations/*")],
};
//# sourceMappingURL=type-rom.config.js.map