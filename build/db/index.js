"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const db = new pg_1.default.Pool({
    host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
    port: 5432,
    user: (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'admin',
    password: (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : 'admin',
    database: (_d = process.env.DB_NAME) !== null && _d !== void 0 ? _d : 'test-strapi-bd',
});
exports.default = db;
