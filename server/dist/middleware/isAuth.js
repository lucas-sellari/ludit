"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("You are not logged in! 😵");
    }
    return next();
};
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map