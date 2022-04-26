"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
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
};
//# sourceMappingURL=type-rom.config.js.map