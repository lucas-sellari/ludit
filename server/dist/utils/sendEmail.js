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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (to, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "b7mfbjywo2ei4n6d@ethereal.email",
            pass: "mEnfk9KYDQzXf9CUzm",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const info = yield transporter.sendMail({
        from: "Luquinhas 🤠 <luquinhas@lucasverso.com>",
        to: to,
        subject: "Mudança de Senha",
        html: html,
    });
    console.log("Mensagem enviada: ", info.messageId);
    console.log("Preview URL: ", nodemailer_1.default.getTestMessageUrl(info));
});
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map