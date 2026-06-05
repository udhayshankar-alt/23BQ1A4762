"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
// logging_middleware/logger.ts
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const API_URL = "http://4.224.186.213/evaluation-service/logs";
async function Log(stack, level, pkg, message) {
    const token = process.env.LOG_TOKEN;
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message,
            }),
        });
    }
    catch (err) {
        console.error(err);
    }
}
//# sourceMappingURL=logger.js.map